<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\CourseTestAttemptAnswer;
use App\Models\CourseUser;
use App\Models\UserCourseTestSequence;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseTestUserController extends Controller
{
    public function start(Course $course, CourseTest $courseTest)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $tz = 'Asia/Jakarta';
        $now = now($tz);

        $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
        $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
        $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;

        $isRemedialActive = false;
        $isRemedialEligible = false;

        $attempts = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNotNull('submitted_at')
            ->get();

        $passingScore = (int) ($courseTest->passing_score ?? 70);
        $bestRegularScore = $attempts->where('test_type', 'exam')->max('score');
        $isFailedRegular = is_null($bestRegularScore) || $bestRegularScore < $passingScore;

        if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
            if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                $isRemedialActive = true;
            }
            $isRemedialEligible = $isFailedRegular;
        }

        if ($isRemedialActive) {
            if (!$isRemedialEligible) {
                return back()->with('error', 'Anda tidak berhak mengikuti ujian remedial ini.');
            }
            $testType = 'remedial';
        } else {
            $testType = 'exam';
            $start = $this->parseScheduleDateTime($courseTest->getRawOriginal('start_date'), $tz);
            $end = $this->parseScheduleDateTime($courseTest->getRawOriginal('end_date'), $tz);

            if ($start && $now->lt($start)) {
                return back()->with('error', 'Ujian kelas belum mulai.');
            }

            if ($end && $now->greaterThanOrEqualTo($end)) {
                return back()->with('error', 'Ujian kelas telah ditutup.');
            }
        }

        $attempt = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNull('submitted_at')
            ->first();

        if (!$attempt && !$this->hasRemainingAttempts($courseTest, $user->id)) {
            return back()->with('error', $isRemedialActive ? 'Anda sudah lulus ujian remedial ini.' : 'Batas kesempatan ujian sudah habis.');
        }

        if (!$attempt) {
            CourseTestAttempt::create([
                'user_id' => $user->id,
                'course_test_id' => $courseTest->id,
                'test_type' => $testType,
                'score' => 0,
                'passed' => false,
                'started_at' => now($tz),
            ]);
        }

        session(['active_course_test_id' => $courseTest->id]);

        return redirect()->route('courses.courseTests.exam', [$course->id, $courseTest->id]);
    }

    public function exam(Course $course, CourseTest $courseTest, $questionId = null)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $course->load('user');
        $courseTest->load([
            'questionBank',
            'questions' => function ($query) {
                $query->orderBy('order_no');
            },
            'questions.options',
        ]);

        $tz = 'Asia/Jakarta';
        $now = now($tz);

        $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
        $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
        $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;

        $start = $this->parseScheduleDateTime($courseTest->getRawOriginal('start_date'), $tz);
        $end = $this->parseScheduleDateTime($courseTest->getRawOriginal('end_date'), $tz);

        $isRemedialActive = false;
        $isRemedialEligible = false;

        $attempts = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->get();

        $passingScore = (int) ($courseTest->passing_score ?? 70);
        $bestRegularScore = $attempts->where('test_type', 'exam')->max('score');
        $isFailedRegular = is_null($bestRegularScore) || $bestRegularScore < $passingScore;

        if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
            if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                $isRemedialActive = true;
            }
            $isRemedialEligible = $isFailedRegular;
        }

        if ($isRemedialActive) {
            if (!$isRemedialEligible) {
                return redirect()
                    ->route('courses.detail', $course->id)
                    ->with('error', 'Anda tidak berhak mengikuti ujian remedial ini.');
            }
            
            // Check if remedial has ended
            if ($remedialEnd && $now->greaterThanOrEqualTo($remedialEnd)) {
                return redirect()
                    ->route('courses.courseTests.detail', [$course->id, $courseTest->id])
                    ->with('error', 'Ujian remedial telah ditutup.');
            }
        } else {
            if ($start && $now->lt($start)) {
                return redirect()
                    ->route('courses.courseTests.detail', [$course->id, $courseTest->id])
                    ->with('error', 'Ujian kelas belum mulai.');
            }

            $submittedAttempt = $attempts->first();

            if ($submittedAttempt && $end && $now->greaterThanOrEqualTo($end)) {
                return redirect()->route('courses.courseTests.result', [$course->id, $courseTest->id, $submittedAttempt->id]);
            }

            if (!$submittedAttempt && $end && $now->greaterThanOrEqualTo($end)) {
                return redirect()
                    ->route('courses.courseTests.detail', [$course->id, $courseTest->id])
                    ->with('error', 'Ujian kelas telah ditutup.');
            }
        }

        if (session('active_course_test_id') !== $courseTest->id) {
            session(['active_course_test_id' => $courseTest->id]);
        }

        $attempt = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNull('submitted_at')
            ->first();

        if (!$attempt && !$this->hasRemainingAttempts($courseTest, $user->id)) {
            return redirect()
                ->route('courses.courseTests.detail', [$course->id, $courseTest->id])
                ->with('error', 'Batas kesempatan ujian sudah habis.');
        }

        if (!$attempt) {
            $attempt = $this->getOrCreateAttempt($courseTest, $user->id);
        }

        $sequence = UserCourseTestSequence::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->where('test_type', 'exam')
            ->first();

        if (!$sequence) {
            $qIds = $courseTest->questions->pluck('id')->shuffle()->values()->all();
            $optSeq = [];

            foreach ($courseTest->questions as $question) {
                $ids = optional($question->options)->pluck('id')->shuffle()->values()->all();
                if (is_array($ids) && count($ids) > 1) {
                    $correct = optional($question->options)->firstWhere('is_correct', true);
                    if ($correct && isset($ids[0]) && $ids[0] === $correct->id) {
                        $swapIndex = random_int(1, count($ids) - 1);
                        [$ids[0], $ids[$swapIndex]] = [$ids[$swapIndex], $ids[0]];
                    }
                }
                $optSeq[$question->id] = $ids;
            }

            $sequence = UserCourseTestSequence::create([
                'user_id' => $user->id,
                'course_test_id' => $courseTest->id,
                'test_type' => 'exam',
                'question_sequence' => $qIds,
                'option_sequences' => $optSeq,
            ]);
        }

        $duration = (int) ($courseTest->duration ?? 0);
        $durationDeadline = null;
        $effectiveDeadline = null;

        if ($duration > 0 && $attempt->started_at) {
            $durationDeadline = Carbon::parse($attempt->started_at)->addMinutes($duration);
            $effectiveDeadline = $durationDeadline;
        }

        $deadline = $attempt->test_type === 'remedial' ? $remedialEnd : $end;

        if ($deadline) {
            $effectiveDeadline = $effectiveDeadline
                ? ($deadline->lt($effectiveDeadline) ? $deadline : $effectiveDeadline)
                : $deadline;
        }

        if ($effectiveDeadline && $now->gt($effectiveDeadline)) {
            $this->finalizeAttempt($courseTest, $attempt);
            session()->forget('active_course_test_id');

            return redirect()->route('courses.courseTests.detail', [$course->id, $courseTest->id]);
        }

        $questions = $this->getDisplayedQuestionsForUser($courseTest, $user->id, $courseTest->questions);

        $current = null;
        if ($questions->count() > 0) {
            if ($questionId) {
                $current = $questions->firstWhere('id', $questionId) ?? $questions->first();
            } else {
                $current = $questions->first();
            }
        }

        $prevId = null;
        $nextId = null;

        if ($current) {
            $idx = $questions->search(fn($q) => $q->id === $current->id);
            if ($idx !== false) {
                $prev = $questions->get(max(0, $idx - 1));
                $next = $questions->get(min($questions->count() - 1, $idx + 1));
                $prevId = $idx > 0 ? $prev?->id : null;
                $nextId = $idx < ($questions->count() - 1) ? $next?->id : null;
            }
        }

        $index = $questions->values()->map(fn($q, $i) => [
            'id' => $q->id,
            'order_no' => $i + 1,
        ]);

        $answeredIds = $attempt->answers()->pluck('question_id')->toArray();
        $answeredCount = is_array($answeredIds) ? count($answeredIds) : 0;

        $currentAnswer = null;
        if ($current) {
            $answer = $attempt->answers()->where('question_id', $current->id)->first();
            if ($answer) {
                $currentAnswer = [
                    'option_id' => $answer->answer,
                    'answer' => $answer->answer,
                ];
            }
        }

        if ($current && isset($sequence->option_sequences[$current->id]) && $current->options) {
            $seq = $sequence->option_sequences[$current->id];
            if (is_array($seq) && count($seq) > 1) {
                $correct = $current->options?->firstWhere('is_correct', true);
                if ($correct && $seq[0] === $correct->id) {
                    $swapIndex = count($seq) > 2 ? random_int(1, count($seq) - 1) : 1;
                    [$seq[0], $seq[$swapIndex]] = [$seq[$swapIndex], $seq[0]];
                }
            }
            $optOrder = array_flip($seq);
            $current->setRelation('options', $current->options->sortBy(function ($option) use ($optOrder) {
                return $optOrder[$option->id] ?? PHP_INT_MAX;
            })->values());
        }

        return Inertia::render('Course/CourseTest/Exam', [
            'course' => $course,
            'test' => $courseTest,
            'teacher' => $course->user,
            'currentQuestion' => $current,
            'nextQuestionId' => $nextId,
            'prevQuestionId' => $prevId,
            'questionIndex' => $index,
            'answeredQuestionIds' => $answeredIds,
            'answeredCount' => $answeredCount,
            'currentAnswer' => $currentAnswer,
            'deadline' => optional($effectiveDeadline)->toIso8601String(),
            'durationDeadline' => optional($durationDeadline)->toIso8601String(),
            'serverNow' => $now->toIso8601String(),
            'flushSavedCount' => session('saved_count'),
        ]);
    }

    public function saveAnswersBulk(Request $request, Course $course, CourseTest $courseTest)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $courseTest->load(['questions.options']);

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|uuid',
            'answers.*.option_id' => 'nullable|uuid',
            'answers.*.answer' => 'nullable|string',
        ]);

        $attempt = $this->getOrCreateAttempt($courseTest, $user->id);
        $questionMap = $courseTest->questions->keyBy('id');

        foreach ($validated['answers'] as $answerPayload) {
            $question = $questionMap->get($answerPayload['question_id']);
            if (!$question) {
                continue;
            }

            $isCorrect = false;
            $storedAnswer = $answerPayload['answer'] ?? null;

            if (in_array($question->question_type, ['multiple_choice', 'true_false'])) {
                if (!empty($answerPayload['option_id'])) {
                    $option = $question->options->firstWhere('id', $answerPayload['option_id']);
                    if ($option) {
                        $isCorrect = (bool) $option->is_correct;
                        $storedAnswer = $option->id;
                    }
                } elseif ($question->question_type === 'true_false' && !empty($storedAnswer)) {
                    $raw = strtolower(trim($storedAnswer));
                    $canonical = in_array($raw, ['true', 'benar']) ? 'benar' : (in_array($raw, ['false', 'salah']) ? 'salah' : $raw);
                    $matched = $question->options->first(function ($option) use ($canonical) {
                        return strtolower(trim($option->option_text)) === $canonical;
                    });
                    if ($matched) {
                        $isCorrect = (bool) $matched->is_correct;
                        $storedAnswer = $matched->id;
                    }
                }
            }

            $attemptAnswer = CourseTestAttemptAnswer::firstOrNew([
                'course_test_attempt_id' => $attempt->id,
                'question_id' => $question->id,
            ]);

            $attemptAnswer->answer = $storedAnswer;
            $attemptAnswer->is_correct = $isCorrect;
            $attemptAnswer->save();
        }

        if ($request->header('X-Inertia')) {
            $current = $request->input('current');

            return redirect()
                ->route('courses.courseTests.exam', [$course->id, $courseTest->id, $current])
                ->with('saved_count', count($validated['answers']));
        }

        return response()->json([
            'message' => 'Jawaban tersimpan.',
            'saved_count' => count($validated['answers']),
        ]);
    }

    public function submitAttempt(Course $course, CourseTest $courseTest)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $courseTest->load(['questions.options']);

        $attempt = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNull('submitted_at')
            ->firstOrFail();

        $this->finalizeAttempt($courseTest, $attempt);

        session()->forget('active_course_test_id');

        return redirect()->route('courses.courseTests.detail', [$course->id, $courseTest->id]);
    }

    public function discardAttempt(Course $course, CourseTest $courseTest)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $attempt = CourseTestAttempt::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->whereNull('submitted_at')
            ->first();

        if ($attempt) {
            $attempt->answers()->delete();
            $attempt->delete();
        }

        UserCourseTestSequence::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->where('test_type', 'exam')
            ->delete();

        session()->forget('active_course_test_id');

        return redirect()
            ->route('courses.courseTests.detail', [$course->id, $courseTest->id])
            ->with('success', 'Jawaban ujian dihapus dan sesi direset.');
    }

    public function result(Course $course, CourseTest $courseTest, $attemptId)
    {
        $this->ensureCourseTestBelongsToCourse($course, $courseTest);
        $user = Auth::user();

        $this->ensureParticipant($course, $user->id);

        $courseTest->load(['questions.options']);

        $attempt = CourseTestAttempt::where('id', $attemptId)
            ->where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->firstOrFail();

        $sequence = UserCourseTestSequence::where('user_id', $user->id)
            ->where('course_test_id', $courseTest->id)
            ->where('test_type', 'exam')
            ->first();

        $answers = $attempt->answers()->get()->keyBy('question_id');
        $questions = $this->getDisplayedQuestionsForUser($courseTest, $user->id, $courseTest->questions);

        $review = $questions->map(function ($question) use ($answers, $sequence) {
            $options = $question->options;

            if ($sequence && is_array($sequence->option_sequences) && isset($sequence->option_sequences[$question->id]) && $options) {
                $seq = $sequence->option_sequences[$question->id];
                if (is_array($seq) && count($seq) > 1) {
                    $correct = $options?->firstWhere('is_correct', true);
                    if ($correct && $seq[0] === $correct->id) {
                        $swapIndex = count($seq) > 2 ? random_int(1, count($seq) - 1) : 1;
                        [$seq[0], $seq[$swapIndex]] = [$seq[$swapIndex], $seq[0]];
                    }
                }

                $optOrder = array_flip($seq);
                $options = $options->sortBy(function ($option) use ($optOrder) {
                    return $optOrder[$option->id] ?? PHP_INT_MAX;
                })->values();
            }

            $answer = $answers->get($question->id);
            $selectedOptionId = $answer?->answer;
            $correctOption = $options?->firstWhere('is_correct', true);

            return [
                'id' => $question->id,
                'order_no' => null,
                'question_text' => $question->question_text,
                'question_type' => $question->question_type,
                'selected' => $question->question_type === 'short_answer' ? ($answer?->answer ?? null) : $selectedOptionId,
                'is_correct' => $answer?->is_correct ?? null,
                'correct_option_id' => $correctOption?->id,
                'correct_option_text' => $correctOption?->option_text,
                'options' => $options?->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                        'is_correct' => (bool) $option->is_correct,
                    ];
                }),
            ];
        });

        return Inertia::render('Course/CourseTest/Result', [
            'course' => $course,
            'test' => $courseTest,
            'attempt' => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'passed' => (bool) $attempt->passed,
                'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
            ],
            'review' => $review,
        ]);
    }

    private function ensureCourseTestBelongsToCourse(Course $course, CourseTest $courseTest): void
    {
        if ($courseTest->course_id !== $course->id) {
            abort(404);
        }
    }

    private function ensureParticipant(Course $course, string $userId): CourseUser
    {
        $participant = CourseUser::where('course_id', $course->id)
            ->where('user_id', $userId)
            ->first();

        if (!$participant) {
            abort(403, 'Anda tidak memiliki akses ke ujian kelas ini.');
        }

        return $participant;
    }

    private function getOrCreateAttempt(CourseTest $courseTest, string $userId): CourseTestAttempt
    {
        $attempt = CourseTestAttempt::where('user_id', $userId)
            ->where('course_test_id', $courseTest->id)
            ->whereNull('submitted_at')
            ->first();

        if (!$attempt) {
            if (!$this->hasRemainingAttempts($courseTest, $userId)) {
                abort(403, 'Batas kesempatan ujian sudah habis.');
            }

            // Determine test type
            $tz = 'Asia/Jakarta';
            $now = now($tz);
            $course = $courseTest->course;
            $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
            $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
            $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;

            $isRemedialActive = false;
            if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
                if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                    $isRemedialActive = true;
                }
            }

            $attempt = CourseTestAttempt::create([
                'user_id' => $userId,
                'course_test_id' => $courseTest->id,
                'test_type' => $isRemedialActive ? 'remedial' : 'exam',
                'score' => 0,
                'passed' => false,
                'started_at' => now('Asia/Jakarta'),
            ]);
        }

        return $attempt;
    }

    private function hasRemainingAttempts(CourseTest $courseTest, string $userId): bool
    {
        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $course = $courseTest->course;
        $courseEnd = $course->end_date ? Carbon::parse($course->end_date, $tz) : null;
        $remedialStart = $courseEnd ? $courseEnd->copy()->addDay()->startOfDay() : null;
        $remedialEnd = $courseTest->remedial_end_date ? Carbon::parse($courseTest->remedial_end_date, $tz) : null;

        $isRemedialActive = false;
        if ($courseTest->remedial_enabled && $remedialStart && $now->greaterThanOrEqualTo($remedialStart)) {
            if (!$remedialEnd || $now->lessThanOrEqualTo($remedialEnd)) {
                $isRemedialActive = true;
            }
        }

        if ($isRemedialActive) {
            // Remedial attempts are unlimited until they score >= passing_score
            $passingScore = (int) ($courseTest->passing_score ?? 70);
            $bestScore = CourseTestAttempt::where('user_id', $userId)
                ->where('course_test_id', $courseTest->id)
                ->whereNotNull('submitted_at')
                ->max('score') ?? 0;
            return $bestScore < $passingScore;
        }

        $maxAttempts = max(0, (int) ($courseTest->max_attempts ?? 0));

        if ($maxAttempts <= 0) {
            return true;
        }

        $submittedCount = CourseTestAttempt::where('user_id', $userId)
            ->where('course_test_id', $courseTest->id)
            ->where('test_type', 'exam')
            ->whereNotNull('submitted_at')
            ->count();

        return $submittedCount < $maxAttempts;
    }

    private function finalizeAttempt(CourseTest $courseTest, CourseTestAttempt $attempt): int
    {
        $displayedQuestions = $this->getDisplayedQuestionsForUser($courseTest, $attempt->user_id, $courseTest->questions);

        $gradedQuestions = $displayedQuestions->filter(function ($question) {
            return in_array($question->question_type, ['multiple_choice', 'true_false']);
        });

        $total = $gradedQuestions->count();

        $answers = $attempt->answers()->whereIn('question_id', $gradedQuestions->pluck('id'))->get();
        $correct = $answers->where('is_correct', true)->count();
        $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;

        $attempt->score = $score;
        $passingScore = (int) ($courseTest->passing_score ?? 70);
        $attempt->passed = $score >= $passingScore;
        $attempt->submitted_at = now('Asia/Jakarta');
        $attempt->save();

        return $score;
    }

    private function resolveQuestionsToShowCount(CourseTest $courseTest, int $totalQuestions): int
    {
        if ($totalQuestions <= 0) {
            return 0;
        }

        $configured = (int) ($courseTest->questions_to_show ?? 0);
        if ($configured <= 0) {
            return $totalQuestions;
        }

        return min($configured, $totalQuestions);
    }

    private function parseScheduleDateTime(?string $value, string $timezone): ?Carbon
    {
        if (empty($value)) {
            return null;
        }

        $normalized = trim((string) $value);

        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/', $normalized, $matched) === 1) {
            return Carbon::create(
                (int) $matched[1],
                (int) $matched[2],
                (int) $matched[3],
                (int) $matched[4],
                (int) $matched[5],
                (int) ($matched[6] ?? 0),
                $timezone,
            );
        }

        try {
            return Carbon::parse($normalized, $timezone);
        } catch (\Throwable $exception) {
            return null;
        }
    }

    private function getDisplayedQuestionsForUser(CourseTest $courseTest, string $userId, $allQuestions = null)
    {
        $questions = $allQuestions ?? $courseTest->questions;

        $sequence = UserCourseTestSequence::where('user_id', $userId)
            ->where('course_test_id', $courseTest->id)
            ->where('test_type', 'exam')
            ->first();

        if ($sequence && is_array($sequence->question_sequence)) {
            $orderMap = array_flip($sequence->question_sequence);
            $questions = $questions->sortBy(function ($question) use ($orderMap) {
                return $orderMap[$question->id] ?? PHP_INT_MAX;
            })->values();
        }

        $limit = $this->resolveQuestionsToShowCount($courseTest, $questions->count());

        if ($limit <= 0) {
            return collect();
        }

        return $questions->take($limit)->values();
    }
}
