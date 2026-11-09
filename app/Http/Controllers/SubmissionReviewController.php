<?php

namespace App\Http\Controllers;

use App\Http\Requests\RejectSubmissionRequest;
use App\Models\Course;
use App\Models\CourseSubmission;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\CourseUser;
use App\Models\Submission;
use App\Models\SubmissionReview;
use App\Models\UserCourseTestSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubmissionReviewController extends Controller
{
    public function indexAdmin(Request $request)
    {
        $query = Submission::query()
            ->with([
                'user:id,name,email,institution',
                'course:id,name,code,teacher_id',
                'course.teacher:id,name,email',
                'courseTest:id,title,duration,passing_score',
                'courseSubmission:id,title,deadline',
                'reviewer:id,name,email',
                'reviews' => function ($q) {
                    $q->with('reviewer:id,name,email')->orderBy('created_at', 'desc');
                },
            ]);

        $this->applyFilters($query, $request);

        $submissions = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        $courses = Course::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Admin/Submission/Index', [
            'submissions' => $submissions,
            'courses' => $courses,
            'filters' => $request->only(['search', 'course_id', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function indexTeacher(Request $request)
    {
        $teacher = Auth::user();
        $teacherCourses = Course::where('teacher_id', $teacher->id)->get(['id', 'name', 'code']);
        $teacherCourseIds = $teacherCourses->pluck('id');

        $query = Submission::query()
            ->whereIn('course_id', $teacherCourseIds)
            ->with([
                'user:id,name,email,institution',
                'course:id,name,code,teacher_id',
                'courseTest:id,title,duration,passing_score',
                'courseSubmission:id,title,deadline',
                'reviewer:id,name,email',
                'reviews' => function ($q) {
                    $q->with('reviewer:id,name,email')->orderBy('created_at', 'desc');
                },
            ]);

        $this->applyFilters($query, $request);

        $submissions = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Teacher/Submission/Index', [
            'submissions' => $submissions,
            'courses' => $teacherCourses,
            'filters' => $request->only(['search', 'course_id', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function approve(Request $request, Submission $submission)
    {
        $this->authorizeReviewer($submission);

        if ($submission->isApproved()) {
            return back()->with('error', 'Submission ini sudah disetujui sebelumnya.');
        }

        DB::transaction(function () use ($submission) {
            $submission->update([
                'status' => 'approved',
                'admin_notes' => null,
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

            SubmissionReview::create([
                'submission_id' => $submission->id,
                'reviewer_id' => Auth::id(),
                'action' => 'approved',
                'notes' => null,
                'created_at' => now(),
            ]);
        });

        return back()->with('success', 'Submission berhasil disetujui. Akses ujian telah dibuka untuk siswa.');
    }

    public function approveAll(Request $request, Course $course, CourseSubmission $courseSubmission)
    {
        if ($courseSubmission->course_id !== $course->id) {
            abort(404, 'Tugas submission tidak ditemukan pada kelas ini.');
        }

        $user = Auth::user();
        if ($user->role !== 'admin' && !($user->role === 'pengajar' && $course->teacher_id === $user->id)) {
            abort(403, 'Anda tidak memiliki hak otorisasi untuk mereview submission pada kelas ini.');
        }

        $includeUnsubmitted = $request->boolean('include_unsubmitted', true);

        $now = now();
        $approvedCount = 0;

        DB::transaction(function () use ($course, $courseSubmission, $user, $includeUnsubmitted, $now, &$approvedCount) {
            // 1. Approve all existing submissions that are not yet approved
            $existingSubmissions = Submission::where('course_submission_id', $courseSubmission->id)
                ->where('status', '!=', 'approved')
                ->get();

            foreach ($existingSubmissions as $submission) {
                $submission->update([
                    'status' => 'approved',
                    'admin_notes' => null,
                    'reviewed_by' => $user->id,
                    'reviewed_at' => $now,
                ]);

                SubmissionReview::create([
                    'submission_id' => $submission->id,
                    'reviewer_id' => $user->id,
                    'action' => 'approved',
                    'notes' => 'Disetujui massal (ACC Semua) oleh ' . ($user->role === 'admin' ? 'admin' : 'pengajar'),
                    'created_at' => $now,
                ]);

                $approvedCount++;
            }

            // 2. If includeUnsubmitted is true, create approved submission records for participants who haven't submitted
            if ($includeUnsubmitted) {
                $participantUserIds = CourseUser::where('course_id', $course->id)->pluck('user_id')->toArray();
                $participantUserIds = array_diff($participantUserIds, [$user->id]);

                $alreadySubmittedUserIds = Submission::where('course_submission_id', $courseSubmission->id)
                    ->pluck('user_id')
                    ->toArray();

                $unsubmittedUserIds = array_diff($participantUserIds, $alreadySubmittedUserIds);

                foreach ($unsubmittedUserIds as $userId) {
                    $newSub = Submission::create([
                        'course_id' => $course->id,
                        'course_submission_id' => $courseSubmission->id,
                        'course_test_id' => null,
                        'course_module_id' => null,
                        'user_id' => $userId,
                        'file_path' => 'system/direct_acc',
                        'original_filename' => 'Disetujui Langsung oleh Pengajar',
                        'file_size' => 0,
                        'mime_type' => 'text/plain',
                        'student_notes' => 'Disetujui massal oleh pengajar.',
                        'status' => 'approved',
                        'admin_notes' => null,
                        'reviewed_by' => $user->id,
                        'reviewed_at' => $now,
                        'version' => 1,
                    ]);

                    SubmissionReview::create([
                        'submission_id' => $newSub->id,
                        'reviewer_id' => $user->id,
                        'action' => 'approved',
                        'notes' => 'Disetujui massal (ACC Semua) langsung oleh ' . ($user->role === 'admin' ? 'admin' : 'pengajar'),
                        'created_at' => $now,
                    ]);

                    $approvedCount++;
                }
            }
        });

        return back()->with('success', "Berhasil menyetujui (ACC) {$approvedCount} siswa untuk tugas '{$courseSubmission->title}'. Akses ujian telah dibuka.");
    }

    public function reject(RejectSubmissionRequest $request, Submission $submission)
    {
        $this->authorizeReviewer($submission);

        DB::transaction(function () use ($request, $submission) {
            $submission->update([
                'status' => 'rejected',
                'admin_notes' => $request->admin_notes,
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

            SubmissionReview::create([
                'submission_id' => $submission->id,
                'reviewer_id' => Auth::id(),
                'action' => 'rejected',
                'notes' => $request->admin_notes,
                'created_at' => now(),
            ]);

            // Tangani attempt aktif jika ada
            $testIds = [];
            if ($submission->course_test_id) {
                $testIds[] = $submission->course_test_id;
            }
            if ($submission->course_submission_id) {
                $linkedTestIds = CourseTest::where('course_submission_id', $submission->course_submission_id)->pluck('id')->toArray();
                $testIds = array_merge($testIds, $linkedTestIds);
            }

            if (!empty($testIds)) {
                $activeAttempts = CourseTestAttempt::whereIn('course_test_id', $testIds)
                    ->where('user_id', $submission->user_id)
                    ->whereNull('submitted_at')
                    ->get();

                foreach ($activeAttempts as $attempt) {
                    $attempt->answers()->delete();
                    $attempt->delete();
                }

                // Bersihkan sequence yang sedang aktif
                UserCourseTestSequence::whereIn('course_test_id', $testIds)
                    ->where('user_id', $submission->user_id)
                    ->where('test_type', 'exam')
                    ->delete();
            }
        });

        return back()->with('success', 'Submission berhasil ditolak dengan catatan.');
    }

    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('course_id')) {
            $query->where('course_id', $request->string('course_id')->value());
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->value());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('course', function ($cq) use ($search) {
                    $cq->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                })->orWhereHas('courseTest', function ($tq) use ($search) {
                    $tq->where('title', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->value());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->value());
        }
    }

    private function authorizeReviewer(Submission $submission): void
    {
        $user = Auth::user();

        // Pencegahan self-approval jika siswa adalah pemilik
        if ($submission->user_id === $user->id) {
            abort(403, 'Anda tidak dapat memproses submission Anda sendiri.');
        }

        // Admin diizinkan untuk semua
        if ($user->role === 'admin') {
            return;
        }

        // Pengajar hanya diizinkan untuk kelas miliknya
        if ($user->role === 'pengajar' && $submission->course->teacher_id === $user->id) {
            return;
        }

        abort(403, 'Anda tidak memiliki hak otorisasi untuk mereview submission pada kelas ini.');
    }
}

