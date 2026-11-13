<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Course;
use App\Models\CourseSubmission;
use App\Models\CourseTest;
use App\Models\CourseUser;
use App\Models\Submission;
use App\Models\SubmissionReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    public function store(StoreSubmissionRequest $request, Course $course, CourseTest $courseTest)
    {
        $user = Auth::user();

        // 1. Validasi pendaftaran kelas
        $isEnrolled = CourseUser::where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isEnrolled) {
            return back()->with('error', 'Anda tidak terdaftar di kelas ini.');
        }

        // 2. Validasi kepemilikan ujian dalam kelas
        if ($courseTest->course_id !== $course->id) {
            abort(404, 'Ujian tidak ditemukan dalam kelas ini.');
        }

        // 3. Validasi bahwa ujian mewajibkan submission
        if (!$courseTest->requires_submission) {
            return back()->with('error', 'Ujian ini tidak memerlukan submission.');
        }

        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $safeName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $storedPath = $file->storeAs("submissions/{$course->id}/{$courseTest->id}", $safeName, 'local');

        $errorMessage = null;

        DB::transaction(function () use (
            $course,
            $courseTest,
            $user,
            $storedPath,
            $originalFilename,
            $fileSize,
            $mimeType,
            $request,
            &$errorMessage
        ) {
            $existing = Submission::where('course_test_id', $courseTest->id)
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                if ($existing->isApproved()) {
                    $errorMessage = 'Submission Anda sudah disetujui.';
                    return;
                }

                if ($existing->isPending()) {
                    $errorMessage = 'Submission Anda masih dalam proses peninjauan.';
                    return;
                }

                // Resubmission jika sebelumnya rejected
                $existing->update([
                    'file_path' => $storedPath,
                    'original_filename' => $originalFilename,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'student_notes' => $request->student_notes,
                    'status' => 'pending_review',
                    'admin_notes' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                    'version' => $existing->version + 1,
                ]);

                SubmissionReview::create([
                    'submission_id' => $existing->id,
                    'reviewer_id' => null,
                    'action' => 'resubmitted',
                    'notes' => $request->student_notes,
                    'file_path' => $storedPath,
                    'created_at' => now(),
                ]);
            } else {
                // First submission
                $submission = Submission::create([
                    'course_id' => $course->id,
                    'course_test_id' => $courseTest->id,
                    'user_id' => $user->id,
                    'file_path' => $storedPath,
                    'original_filename' => $originalFilename,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'student_notes' => $request->student_notes,
                    'status' => 'pending_review',
                    'version' => 1,
                ]);

                SubmissionReview::create([
                    'submission_id' => $submission->id,
                    'reviewer_id' => null,
                    'action' => 'submitted',
                    'notes' => $request->student_notes,
                    'file_path' => $storedPath,
                    'created_at' => now(),
                ]);
            }
        });

        if ($errorMessage) {
            // Hapus file yang baru diunggah jika transaksi dibatalkan karena status tidak valid
            Storage::disk('local')->delete($storedPath);
            return back()->with('error', $errorMessage);
        }

        return back()->with('success', 'Submission berhasil dikirim dan sedang menunggu peninjauan.');
    }

    public function storeCourseSubmission(StoreSubmissionRequest $request, Course $course, CourseSubmission $courseSubmission)
    {
        $user = Auth::user();

        // 1. Validasi pendaftaran kelas
        $isEnrolled = CourseUser::where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isEnrolled) {
            return back()->with('error', 'Anda tidak terdaftar di kelas ini.');
        }

        // 2. Validasi kepemilikan submission dalam kelas
        if ($courseSubmission->course_id !== $course->id) {
            abort(404, 'Tugas submission tidak ditemukan dalam kelas ini.');
        }

        // 3. Validasi deadline: jika deadline terlewat, siswa tidak boleh submit/edit
        if ($courseSubmission->deadline && now()->gt($courseSubmission->deadline)) {
            return back()->with('error', 'Batas waktu pengumpulan tugas ini telah berakhir.');
        }

        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $safeName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $storedPath = $file->storeAs("submissions/{$course->id}/tasks/{$courseSubmission->id}", $safeName, 'local');

        $errorMessage = null;
        $isEdit = false;

        DB::transaction(function () use (
            $course,
            $courseSubmission,
            $user,
            $storedPath,
            $originalFilename,
            $fileSize,
            $mimeType,
            $request,
            &$errorMessage,
            &$isEdit
        ) {
            $existing = Submission::where('course_submission_id', $courseSubmission->id)
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                $isEdit = true;

                // Jika sudah di-ACC (approved), siswa tidak boleh edit
                if ($existing->isApproved()) {
                    $errorMessage = 'Submission Anda sudah disetujui (ACC) dan tidak dapat diubah lagi.';
                    return;
                }

                // Siswa boleh edit sebelum deadline / sebelum di-ACC
                $isResubmitAfterReject = $existing->isRejected();

                $existing->update([
                    'file_path' => $storedPath,
                    'original_filename' => $originalFilename,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'student_notes' => $request->student_notes,
                    'status' => 'pending_review',
                    'admin_notes' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                    'version' => $existing->version + 1,
                ]);

                SubmissionReview::create([
                    'submission_id' => $existing->id,
                    'reviewer_id' => null,
                    'action' => 'resubmitted',
                    'notes' => $request->student_notes,
                    'file_path' => $storedPath,
                    'created_at' => now(),
                ]);
            } else {
                // First submission
                $submission = Submission::create([
                    'course_id' => $course->id,
                    'course_submission_id' => $courseSubmission->id,
                    'user_id' => $user->id,
                    'file_path' => $storedPath,
                    'original_filename' => $originalFilename,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'student_notes' => $request->student_notes,
                    'status' => 'pending_review',
                    'version' => 1,
                ]);

                SubmissionReview::create([
                    'submission_id' => $submission->id,
                    'reviewer_id' => null,
                    'action' => 'submitted',
                    'notes' => $request->student_notes,
                    'file_path' => $storedPath,
                    'created_at' => now(),
                ]);
            }
        });

        if ($errorMessage) {
            Storage::disk('local')->delete($storedPath);
            return back()->with('error', $errorMessage);
        }

        return back()->with('success', $isEdit
            ? 'Submission tugas berhasil diperbarui dan sedang menunggu peninjauan.'
            : 'Tugas submission berhasil dikirim dan sedang menunggu peninjauan.'
        );
    }

    public function download(Submission $submission)
    {
        $this->authorizeSubmissionAccess($submission);

        if (!Storage::disk('local')->exists($submission->file_path)) {
            abort(404, 'Berkas submission tidak ditemukan.');
        }

        return Storage::disk('local')->download(
            $submission->file_path,
            $submission->original_filename
        );
    }

    public function downloadReview(SubmissionReview $review)
    {
        $submission = $review->submission;
        $this->authorizeSubmissionAccess($submission);

        if (!$review->file_path || !Storage::disk('local')->exists($review->file_path)) {
            abort(404, 'Berkas riwayat submission tidak ditemukan.');
        }

        $extension = pathinfo($review->file_path, PATHINFO_EXTENSION);
        $downloadName = "submission_v{$review->created_at?->format('Ymd_His')}.{$extension}";

        return Storage::disk('local')->download(
            $review->file_path,
            $downloadName
        );
    }

    public function preview(Submission $submission)
    {
        $this->authorizeSubmissionAccess($submission);

        if (!Storage::disk('local')->exists($submission->file_path)) {
            abort(404, 'Berkas submission tidak ditemukan.');
        }

        $fullPath = Storage::disk('local')->path($submission->file_path);
        $mimeType = $submission->mime_type ?: (mime_content_type($fullPath) ?: 'application/octet-stream');

        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $submission->original_filename . '"',
        ]);
    }

    public function previewReview(SubmissionReview $review)
    {
        $submission = $review->submission;
        $this->authorizeSubmissionAccess($submission);

        if (!$review->file_path || !Storage::disk('local')->exists($review->file_path)) {
            abort(404, 'Berkas riwayat submission tidak ditemukan.');
        }

        $fullPath = Storage::disk('local')->path($review->file_path);
        $extension = pathinfo($review->file_path, PATHINFO_EXTENSION);
        $previewName = "submission_v{$review->created_at?->format('Ymd_His')}.{$extension}";
        $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $previewName . '"',
        ]);
    }

    private function authorizeSubmissionAccess(Submission $submission): void
    {
        $user = Auth::user();

        // 1. Siswa pemilik submission
        if ($submission->user_id === $user->id) {
            return;
        }

        // 2. Admin
        if ($user->role === 'admin') {
            return;
        }

        // 3. Pengajar pemilik kelas
        if ($user->role === 'pengajar' && $submission->course->teacher_id === $user->id) {
            return;
        }

        abort(403, 'Anda tidak memiliki hak akses untuk melihat atau mengunduh berkas ini.');
    }
}

