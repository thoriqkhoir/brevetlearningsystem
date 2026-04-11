<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\QuestionBank;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CourseTestController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $this->authorizeCourse($course);

        $validated = $this->validateCourseTestPayload($request);
        $this->validateCourseDateWindow($course, $validated);

        $course->courseTests()->create($validated);

        return back()->with('success', 'Ujian kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Course $course, CourseTest $courseTest)
    {
        $this->authorizeCourse($course);
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);

        $validated = $this->validateCourseTestPayload($request);
        $this->validateCourseDateWindow($course, $validated);

        $courseTest->update($validated);

        return back()->with('success', 'Ujian kelas berhasil diperbarui.');
    }

    public function destroy(Course $course, CourseTest $courseTest)
    {
        $this->authorizeCourse($course);
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);

        $courseTest->delete();

        return back()->with('success', 'Ujian kelas berhasil dihapus.');
    }

    public function detail(Course $course, CourseTest $courseTest)
    {
        $this->authorizeCourse($course);
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);

        $courseTest->load('questionBank');

        $participants = $course->participants()
            ->with('user:id,name,email')
            ->get(['id', 'course_id', 'user_id']);

        $submittedAttempts = CourseTestAttempt::where('course_test_id', $courseTest->id)
            ->whereNotNull('submitted_at')
            ->get(['user_id', 'score', 'submitted_at']);

        $bestScoreByUser = $submittedAttempts
            ->groupBy('user_id')
            ->map(function ($attempts) {
                return (int) $attempts->max('score');
            });

        $participantsData = $participants->map(function ($participant) use ($bestScoreByUser, $courseTest) {
            $bestScore = $bestScoreByUser->get($participant->user_id);
            $hasAttempt = !is_null($bestScore);

            return [
                'id' => $participant->id,
                'user' => $participant->user,
                'best_score' => $hasAttempt ? (int) $bestScore : null,
                'passed' => $hasAttempt
                    ? (int) $bestScore >= (int) ($courseTest->passing_score ?? 0)
                    : null,
            ];
        })->values();

        $overallBestAttempt = $submittedAttempts->reduce(function ($best, $current) {
            if (!$best) {
                return $current;
            }

            $bestScore = (int) $best->score;
            $currentScore = (int) $current->score;

            if ($currentScore > $bestScore) {
                return $current;
            }

            if ($currentScore === $bestScore) {
                $bestSubmittedAt = optional($best->submitted_at)->timestamp ?? 0;
                $currentSubmittedAt = optional($current->submitted_at)->timestamp ?? 0;

                if ($currentSubmittedAt > $bestSubmittedAt) {
                    return $current;
                }
            }

            return $best;
        });

        $overallBestParticipant = null;
        if ($overallBestAttempt) {
            $overallBestParticipant = $participants
                ->firstWhere('user_id', $overallBestAttempt->user_id)
                ?->user;
        }

        return Inertia::render('Teacher/Course/CourseTest/Detail', [
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
            ],
            'courseTest' => $courseTest,
            'statistics' => [
                'total_participants' => $participants->count(),
                'attempted_participants' => $bestScoreByUser->count(),
                'best_score' => $overallBestAttempt ? (int) $overallBestAttempt->score : null,
                'best_score_user' => $overallBestParticipant ? [
                    'id' => $overallBestParticipant->id,
                    'name' => $overallBestParticipant->name,
                ] : null,
            ],
            'participants' => $participantsData,
        ]);
    }

    private function authorizeCourse(Course $course): void
    {
        if ($course->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
    }

    private function ensureCourseTestBelongsToCourse(Course $course, CourseTest $courseTest): void
    {
        if ($courseTest->course_id !== $course->id) {
            abort(404);
        }
    }

    private function validateCourseTestPayload(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'question_bank_id' => [
                'required',
                'uuid',
                Rule::exists('question_banks', 'id')
                    ->where(fn($query) => $query->where('teacher_id', Auth::id())),
            ],
            'questions_to_show' => [
                'nullable',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    if (is_null($value) || $value === '') {
                        return;
                    }

                    $questionBankId = $request->input('question_bank_id');
                    if (!$questionBankId) {
                        return;
                    }

                    $questionCount = QuestionBank::where('id', $questionBankId)
                        ->where('teacher_id', Auth::id())
                        ->withCount('questions')
                        ->value('questions_count');

                    if (is_null($questionCount)) {
                        return;
                    }

                    if ((int) $value > (int) $questionCount) {
                        $fail("Jumlah soal ditampilkan tidak boleh melebihi total soal pada bank ({$questionCount}).");
                    }
                },
            ],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'show_score' => 'nullable|boolean',
        ]);
    }

    private function validateCourseDateWindow(Course $course, array $payload): void
    {
        $startDate = $payload['start_date'] ?? null;
        $endDate = $payload['end_date'] ?? null;

        $courseStart = !empty($course->start_date) ? Carbon::parse($course->start_date) : null;
        $courseEnd = !empty($course->end_date) ? Carbon::parse($course->end_date) : null;
        $testStart = !empty($startDate) ? Carbon::parse($startDate) : null;
        $testEnd = !empty($endDate) ? Carbon::parse($endDate) : null;

        if ($courseStart && $testStart && $testStart->lt($courseStart)) {
            throw ValidationException::withMessages([
                'start_date' => 'Waktu mulai ujian tidak boleh sebelum tanggal mulai kelas.',
            ]);
        }

        if ($courseEnd && $testEnd && $testEnd->gt($courseEnd)) {
            throw ValidationException::withMessages([
                'end_date' => 'Waktu selesai ujian tidak boleh melebihi tanggal selesai kelas.',
            ]);
        }
    }
}
