<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Test;
use App\Models\TestResult;
use App\Models\TestUser;
use App\Models\TestAttempt;
use App\Models\TestAttemptAnswer;
use Carbon\Carbon;
use App\Models\UserTestSequence;

class TestUserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $tests = Test::whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
            ->with(['participants' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        $tests = $tests->map(function ($test) use ($user) {
            $pivot = $test->participants->first();

            $bestScore = null;
            if ($pivot) {
                // Ambil skor terbaik dari tabel test_attempts untuk user & test ini (hanya yang sudah submitted)
                $best = TestAttempt::where('user_id', $user->id)
                    ->where('test_id', $test->id)
                    ->whereNotNull('submitted_at')
                    ->max('score');
                if (!is_null($best)) {
                    $bestScore = (int) $best;
                }
                $test->score = $bestScore; // dipakai di UI sebagai Nilai Terbaik
            } else {
                $test->score = null;
            }

            return $test;
        });

        return Inertia::render('Test/Tests', [
            'tests' => $tests,
        ]);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:tests,code',
        ]);

        $test = Test::where('code', $request->code)->first();

        $exists = TestUser::where('test_id', $test->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Anda sudah bergabung di ujian ini.');
        }

        TestUser::create([
            'test_id' => $test->id,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Berhasil bergabung ke ujian!');
    }

    public function detail($id)
    {
        $user = Auth::user();
        $test = Test::with('user')->findOrFail($id);

        $pivot = TestUser::where('test_id', $id)
            ->where('user_id', $user->id)
            ->first();

        $testResults = [];
        if ($pivot) {
            $testResults = TestResult::where('test_user_id', $pivot->id)->get();
        }

        // Find last submitted attempt to determine if user already finished this test
        $lastAttempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNotNull('submitted_at')
            ->latest('submitted_at')
            ->first();

        // Fetch all submitted attempts as history (newest first)
        $attemptHistory = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'score' => (int) $a->score,
                    'passed' => (bool) $a->passed,
                    'submitted_at' => optional($a->submitted_at)->toIso8601String(),
                ];
            });

        return Inertia::render('Test/TestDescription', [
            'test' => $test,
            'pivot' => $pivot,
            'teacher' => $test->user,
            'testResults' => $testResults,
            'attemptHistory' => $attemptHistory,
            'lastAttempt' => $lastAttempt ? [
                'id' => $lastAttempt->id,
                'score' => $lastAttempt->score,
                'passed' => (bool)$lastAttempt->passed,
                'submitted_at' => optional($lastAttempt->submitted_at)->toIso8601String(),
            ] : null,
        ]);
    }

    public function exam($id, $questionId = null)
    {
        $user = Auth::user();
        $test = Test::with([
            'user',
            'questions' => function ($q) {
                $q->orderBy('order_no');
            },
            'questions.options',
        ])->findOrFail($id);

        // Close access if outside schedule

        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $start = !empty($test->start_date)
            ? Carbon::parse($test->start_date, $tz)
            : null;
        $end = !empty($test->end_date)
            ? Carbon::parse($test->end_date, $tz)
            : null;

        if ($start) {
            logger()->info('Exam start guard', [
                'now' => $now->toIso8601String(),
                'start_date' => $start->toIso8601String(),
                'app_tz' => config('app.timezone'),
            ]);
        }

        if ($start && $now->lt($start)) {
            if (request()->boolean('debug')) {
                return response()->json([
                    'blocked_by' => 'start_date',
                    'now' => $now->toIso8601String(),
                    'start_date' => $start->toIso8601String(),
                    'app_timezone' => config('app.timezone'),
                ]);
            }

            return redirect()
                ->route('tests.detail', $test->id)
                ->with('error', 'Ujian belum mulai.')
                ->with('now', $now->toDateTimeString())
                ->with('start_date', $start->toDateTimeString())
                ->with('app_timezone', config('app.timezone'));
        }
        // if (!empty($test->start_date) && now()->lessThan(Carbon::parse($test->start_date))) {
        //     return redirect()->route('tests.detail', $test->id)->with('error', 'Ujian belum mulai.');
        // }

        // if (!empty($test->end_date) && now()->greaterThanOrEqualTo(Carbon::parse($test->end_date))) {
        //     // If user has a submitted attempt, show it; otherwise just go back to description
        //     $last = TestAttempt::where('user_id', $user->id)
        //         ->where('test_id', $test->id)
        //         ->whereNotNull('submitted_at')
        //         ->latest('submitted_at')
        //         ->first();
        //     if ($last) {
        //         return redirect()->route('tests.result', [$test->id, $last->id]);
        //     }
        //     return redirect()->route('tests.detail', $test->id)->with('error', 'Ujian telah ditutup.');
        // }

        // Ensure user is a participant
        $pivot = TestUser::where('test_id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // If user has submitted before and exam is already closed by end_date, show last result; otherwise allow retake
        $submittedAttempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNotNull('submitted_at')
            ->latest('submitted_at')
            ->first();
        if ($submittedAttempt && $end && $now->greaterThanOrEqualTo($end)) {
            return redirect()->route('tests.result', [$test->id, $submittedAttempt->id]);
        }

        // If not started in session, set it
        if (session('active_test_id') !== $test->id) {
            session(['active_test_id' => $test->id]);
        }

        // Ensure we have an active attempt (also sets started_at on first open)
        $attempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNull('submitted_at')
            ->first();
        if (!$attempt) {
            $attempt = $this->getOrCreateAttempt($test, $user);
        }

        // Build or fetch per-user randomized sequences
        $sequence = UserTestSequence::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->where('test_type', 'exam')
            ->first();
        if (!$sequence) {
            // randomize questions
            $qIds = $test->questions->pluck('id')->shuffle()->values()->all();
            // randomize options per question
            $optSeq = [];
            foreach ($test->questions as $q) {
                $ids = optional($q->options)->pluck('id')->shuffle()->values()->all();
                if (is_array($ids) && count($ids) > 1) {
                    $correct = optional($q->options)->firstWhere('is_correct', true);
                    if ($correct && isset($ids[0]) && $ids[0] === $correct->id) {
                        $swapIndex = random_int(1, count($ids) - 1);
                        [$ids[0], $ids[$swapIndex]] = [$ids[$swapIndex], $ids[0]];
                    }
                }
                $optSeq[$q->id] = $ids;
            }
            $sequence = UserTestSequence::create([
                'user_id' => $user->id,
                'test_id' => $test->id,
                'test_type' => 'exam',
                'question_sequence' => $qIds,
                'option_sequences' => $optSeq,
            ]);
        }

        // Server-side time enforcement based on min(started_at + duration, test.end_date)
        $duration = (int)($test->duration ?? 0);
        $durationDeadline = null;
        $effectiveDeadline = null;

        if ($duration > 0 && $attempt->started_at) {
            $durationDeadline = Carbon::parse($attempt->started_at)->addMinutes($duration);
            $effectiveDeadline = $durationDeadline;
        }
        if ($end) {
            $effectiveDeadline = $effectiveDeadline
                ? ($end->lt($effectiveDeadline) ? $end : $effectiveDeadline)
                : $end;
        }
        if ($effectiveDeadline && $now->gt($effectiveDeadline)) {
            $score = $this->finalizeAttempt($test, $attempt);
            session()->forget('active_test_id');
            return redirect()->route('tests.detail', $test->id);
        }

        // Determine visible questions for this user based on random sequence + configured limit
        $questions = $this->getDisplayedQuestionsForUser($test, $user->id, $test->questions);
        $current = null;
        if ($questions->count() > 0) {
            if ($questionId) {
                $current = $questions->firstWhere('id', $questionId) ?? $questions->first();
            } else {
                $current = $questions->first();
            }
        }

        // Prev/Next ids
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

        // Provide minimal list for navigation (id and order)
        $index = $questions->values()->map(fn($q, $i) => [
            'id' => $q->id,
            'order_no' => $i + 1,
        ]);

        // Answered tracking from current attempt
        $answeredIds = $attempt ? $attempt->answers()->pluck('question_id')->toArray() : [];
        $answeredCount = is_array($answeredIds) ? count($answeredIds) : 0;
        $currentAnswer = null;
        if ($attempt && $current) {
            $ans = $attempt->answers()->where('question_id', $current->id)->first();
            if ($ans) {
                $currentAnswer = [
                    'option_id' => $ans->answer,
                    'answer' => $ans->answer,
                ];
            }
        }

        // Reorder options for the current question based on user sequence
        if ($current && isset($sequence->option_sequences[$current->id]) && $current->options) {
            // ensure correct option is not first if sequence accidentally set it so
            $seq = $sequence->option_sequences[$current->id];
            if (is_array($seq) && count($seq) > 1) {
                $correct = $current->options?->firstWhere('is_correct', true);
                if ($correct && $seq[0] === $correct->id) {
                    $swapIndex = 1;
                    if (count($seq) > 2) {
                        $swapIndex = random_int(1, count($seq) - 1);
                    }
                    [$seq[0], $seq[$swapIndex]] = [$seq[$swapIndex], $seq[0]];
                }
            }
            $optOrder = array_flip($seq);
            $current->setRelation('options', $current->options->sortBy(function ($o) use ($optOrder) {
                return $optOrder[$o->id] ?? PHP_INT_MAX;
            })->values());
        }

        return Inertia::render('Test/Exam', [
            'test' => $test,
            'pivot' => $pivot,
            'teacher' => $test->user,
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
            // Optional feedback after router.post flush
            'flushSavedCount' => session('saved_count'),
        ]);
    }

    private function getOrCreateAttempt(Test $test, $user)
    {
        $attempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNull('submitted_at')
            ->first();
        if (!$attempt) {
            $attempt = TestAttempt::create([
                'user_id' => $user->id,
                'test_id' => $test->id,
                'test_type' => 'exam',
                'score' => 0,
                'passed' => false,
                'started_at' => now('Asia/Jakarta'),
            ]);
        }
        return $attempt;
    }

    public function saveAnswer(Request $request, $id)
    {
        $user = Auth::user();
        $test = Test::with(['questions.options'])->findOrFail($id);

        $validated = $request->validate([
            'question_id' => 'required|uuid|exists:questions,id',
            'option_id' => 'nullable|uuid',
            'answer' => 'nullable|string',
        ]);

        $question = $test->questions->firstWhere('id', $validated['question_id']);
        if (!$question) return back()->with('error', 'Soal tidak ditemukan untuk ujian ini.');

        $attempt = $this->getOrCreateAttempt($test, $user);

        // Time enforcement switched to accept-then-finalize to avoid last-second data loss
        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $duration = (int)($test->duration ?? 0);
        $effectiveDeadline = null;
        $afterDeadline = false;
        if ($duration > 0 && $attempt->started_at) {
            $effectiveDeadline = Carbon::parse($attempt->started_at)->addMinutes($duration);
        }
        if (!empty($test->end_date)) {
            $end = Carbon::parse($test->end_date);
            $effectiveDeadline = $effectiveDeadline
                ? ($end->lt($effectiveDeadline) ? $end : $effectiveDeadline)
                : $end;
        }
        if ($effectiveDeadline && $now->greaterThanOrEqualTo($effectiveDeadline)) {
            $afterDeadline = true; // mark to finalize after persisting this answer
        }

        $isCorrect = false;
        $storedAnswer = $validated['answer'] ?? null;

        if (in_array($question->question_type, ['multiple_choice', 'true_false'])) {
            // Prefer option_id to evaluate correctness
            if (!empty($validated['option_id'])) {
                $option = $question->options->firstWhere('id', $validated['option_id']);
                if ($option) {
                    $isCorrect = (bool)$option->is_correct;
                    $storedAnswer = $option->id; // store selected option id
                }
            }
            // Fallback mapping for true_false when only textual answer like "true" / "false" / "benar" / "salah" is sent
            elseif ($question->question_type === 'true_false' && !empty($storedAnswer)) {
                $raw = strtolower(trim($storedAnswer));
                // Normalize synonyms
                $canonical = in_array($raw, ['true', 'benar']) ? 'benar' : (in_array($raw, ['false', 'salah']) ? 'salah' : $raw);
                // Try match option by text
                $matched = $question->options->first(function ($opt) use ($canonical) {
                    return strtolower(trim($opt->option_text)) === $canonical;
                });
                if ($matched) {
                    $isCorrect = (bool)$matched->is_correct;
                    $storedAnswer = $matched->id; // store option id for consistency
                }
            }
        }

        // Upsert answer
        $attemptAnswer = TestAttemptAnswer::firstOrNew([
            'test_attempt_id' => $attempt->id,
            'question_id' => $question->id,
        ]);
        $attemptAnswer->answer = $storedAnswer;
        $attemptAnswer->is_correct = $isCorrect;
        $attemptAnswer->save();

        // Note: Do NOT finalize here even if afterDeadline. We'll finalize on explicit submit to avoid
        // splitting answers across multiple attempts when multiple single-saves arrive around the cutoff.
        // Respond appropriately depending on request type
        if ($request->header('X-Inertia')) {
            $current = $request->input('current');
            // Redirect back to the exam page (same question if provided) so Inertia treats this as a valid response
            return redirect()->route('tests.exam', [$id, $current])->with('saved_count', 1);
        }
        if ($request->expectsJson()) {
            return response()->json(['message' => $afterDeadline ? 'Jawaban tersimpan (melewati batas waktu), akan dikumpulkan saat submit.' : 'Jawaban tersimpan.']);
        }
        // Inertia normal visit (router.post) expects either redirect or Inertia response; fallback to redirect back
        return back()->with('success', 'Jawaban tersimpan.');
    }

    public function saveAnswersBulk(Request $request, $id)
    {
        $user = Auth::user();
        $test = Test::with(['questions.options'])->findOrFail($id);

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|uuid',
            'answers.*.option_id' => 'nullable|uuid',
            'answers.*.answer' => 'nullable|string',
        ]);

        $attempt = $this->getOrCreateAttempt($test, $user);

        // Time enforcement switched to accept-then-finalize (bulk)
        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $duration = (int)($test->duration ?? 0);
        $effectiveDeadline = null;
        $afterDeadline = false;
        if ($duration > 0 && $attempt->started_at) {
            $effectiveDeadline = Carbon::parse($attempt->started_at)->addMinutes($duration);
        }
        if (!empty($test->end_date)) {
            $end = Carbon::parse($test->end_date);
            $effectiveDeadline = $effectiveDeadline
                ? ($end->lt($effectiveDeadline) ? $end : $effectiveDeadline)
                : $end;
        }
        if ($effectiveDeadline && $now->greaterThanOrEqualTo($effectiveDeadline)) {
            $afterDeadline = true; // finalize after persisting payload
        }

        // Map questions for quick lookup
        $questionMap = $test->questions->keyBy('id');

        foreach ($validated['answers'] as $ans) {
            $qid = $ans['question_id'];
            $question = $questionMap->get($qid);
            if (!$question) {
                // skip questions that do not belong to this test
                continue;
            }

            $isCorrect = false;
            $storedAnswer = $ans['answer'] ?? null;

            if (in_array($question->question_type, ['multiple_choice', 'true_false'])) {
                if (!empty($ans['option_id'])) {
                    $option = $question->options->firstWhere('id', $ans['option_id']);
                    if ($option) {
                        $isCorrect = (bool)$option->is_correct;
                        $storedAnswer = $option->id;
                    }
                }
                // Fallback mapping for true_false textual answers ("true"/"false"/"benar"/"salah") when option_id not provided
                elseif ($question->question_type === 'true_false' && !empty($storedAnswer)) {
                    $raw = strtolower(trim($storedAnswer));
                    $canonical = in_array($raw, ['true', 'benar']) ? 'benar' : (in_array($raw, ['false', 'salah']) ? 'salah' : $raw);
                    $matched = $question->options->first(function ($opt) use ($canonical) {
                        return strtolower(trim($opt->option_text)) === $canonical;
                    });
                    if ($matched) {
                        $isCorrect = (bool)$matched->is_correct;
                        $storedAnswer = $matched->id;
                    }
                }
            }

            $attemptAnswer = TestAttemptAnswer::firstOrNew([
                'test_attempt_id' => $attempt->id,
                'question_id' => $question->id,
            ]);
            $attemptAnswer->answer = $storedAnswer;
            $attemptAnswer->is_correct = $isCorrect;
            $attemptAnswer->save();
        }

        // When coming from Inertia (router.post), return a redirect so the client receives a valid Inertia response
        if ($request->header('X-Inertia')) {
            $current = $request->input('current');
            return redirect()->route('tests.exam', [$id, $current])->with('saved_count', count($validated['answers']));
        }

        // Otherwise return JSON (e.g., for fetch/XHR use)
        return response()->json([
            'message' => 'Jawaban tersimpan.',
            'saved_count' => count($validated['answers'])
        ]);
    }

    public function submitAttempt($id)
    {
        $user = Auth::user();
        $test = Test::with(['questions.options'])->findOrFail($id);
        $attempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNull('submitted_at')
            ->firstOrFail();

        // Enforce time on submission as well (also covers early submit)
        $score = $this->finalizeAttempt($test, $attempt);

        session()->forget('active_test_id');

        return redirect()->route('tests.detail', $test->id);
    }

    public function startWorking($id)
    {
        $user = Auth::user();
        $test = Test::findOrFail($id);

        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $start = !empty($test->start_date) ? Carbon::parse($test->start_date, $tz) : null;
        $end = !empty($test->end_date) ? Carbon::parse($test->end_date, $tz) : null;

        if ($start && $now->lt($start)) {
            return back()->with('error', 'Ujian belum mulai.');
        }
        if ($end && $now->greaterThanOrEqualTo($end)) {
            return back()->with('error', 'Ujian telah ditutup.');
        }

        $attempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNull('submitted_at')
            ->first();
        if (!$attempt) {
            $attempt = TestAttempt::create([
                'user_id' => $user->id,
                'test_id' => $test->id,
                'test_type' => 'exam',
                'score' => 0,
                'passed' => false,
                'started_at' => now($tz),
            ]);
        } else {
            $resetFlagKey = 'reset_exam_timer_' . $test->id;
            if (session()->has($resetFlagKey) && session($resetFlagKey) === true) {
                $attempt->started_at = now($tz);
                $attempt->save();
                session()->forget($resetFlagKey);
            }
        }
        session(['active_test_id' => $test->id]);
        return redirect()->route('tests.exam', [$test->id]);
    }

    public function stopWorking()
    {
        session()->forget('active_test_id');
        return redirect()->route('tests.index')->with('success', 'Ujian berhasil dihentikan!');
    }

    private function finalizeAttempt(Test $test, TestAttempt $attempt): int
    {
        $displayedQuestions = $this->getDisplayedQuestionsForUser($test, $attempt->user_id, $test->questions);

        // Determine total graded questions (multiple_choice, true_false)
        $gradedQuestions = $displayedQuestions->filter(function ($q) {
            return in_array($q->question_type, ['multiple_choice', 'true_false']);
        });
        $total = $gradedQuestions->count();

        $answers = $attempt->answers()->whereIn('question_id', $gradedQuestions->pluck('id'))->get();
        $correct = $answers->where('is_correct', true)->count();
        $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;

        $attempt->score = $score;
        $attempt->passed = $score >= (int)($test->passing_score ?? 0);
        $attempt->submitted_at = now();
        $attempt->save();

        return $score;
    }

    public function discardAttempt($id)
    {
        $user = Auth::user();
        $test = Test::findOrFail($id);

        // Find active attempt
        $attempt = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->whereNull('submitted_at')
            ->first();
        if ($attempt) {
            // delete all answers; do not touch started_at here
            $attempt->answers()->delete();
            $attempt->score = 0;
            $attempt->passed = false;
            $attempt->save();
        }

        // Optionally drop per-user sequence so questions reshuffle next entry
        UserTestSequence::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->where('test_type', 'exam')
            ->delete();

        // mark that next start should reset timer and clear active flag
        session(['reset_exam_timer_' . $test->id => true]);
        session()->forget('active_test_id');

        return redirect()->route('tests.detail', $test->id)->with('success', 'Jawaban dihapus dan waktu direset.');
    }

    public function result($id, $attemptId)
    {
        $user = Auth::user();
        $test = Test::with([
            'user',
            'questions.options',
        ])->findOrFail($id);
        $attempt = TestAttempt::where('id', $attemptId)
            ->where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->firstOrFail();

        // Apply user sequence ordering for review
        $sequence = UserTestSequence::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->where('test_type', 'exam')
            ->first();
        $answers = $attempt->answers()->get()->keyBy('question_id');
        $questions = $this->getDisplayedQuestionsForUser($test, $user->id, $test->questions);
        $review = $questions->map(function ($q) use ($answers, $sequence) {
            // reorder options for this question according to saved sequence
            $options = $q->options;
            if ($sequence && is_array($sequence->option_sequences) && isset($sequence->option_sequences[$q->id]) && $options) {
                $seq = $sequence->option_sequences[$q->id];
                if (is_array($seq) && count($seq) > 1) {
                    $correct = $options?->firstWhere('is_correct', true);
                    if ($correct && $seq[0] === $correct->id) {
                        $swapIndex = 1;
                        if (count($seq) > 2) {
                            $swapIndex = random_int(1, count($seq) - 1);
                        }
                        [$seq[0], $seq[$swapIndex]] = [$seq[$swapIndex], $seq[0]];
                    }
                }
                $optOrder = array_flip($seq);
                $options = $options->sortBy(function ($o) use ($optOrder) {
                    return $optOrder[$o->id] ?? PHP_INT_MAX;
                })->values();
            }
            $ans = $answers->get($q->id);
            $selectedOptionId = $ans?->answer;
            $selectedOption = $options?->firstWhere('id', $selectedOptionId);
            $correctOption = $options?->firstWhere('is_correct', true);
            return [
                'id' => $q->id,
                'order_no' => null,
                'question_text' => $q->question_text,
                'question_type' => $q->question_type,
                'selected' => $q->question_type === 'short_answer' ? ($ans?->answer ?? null) : $selectedOptionId,
                'is_correct' => $ans?->is_correct ?? null,
                'correct_option_id' => $correctOption?->id,
                'correct_option_text' => $correctOption?->option_text,
                'options' => $options?->map(function ($o) {
                    return ['id' => $o->id, 'option_text' => $o->option_text, 'is_correct' => (bool)$o->is_correct];
                }),
            ];
        });

        return Inertia::render('Test/Result', [
            'test' => $test,
            'attempt' => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'passed' => (bool)$attempt->passed,
                'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
            ],
            'review' => $review,
        ]);
    }

    private function resolveQuestionsToShowCount(Test $test, int $totalQuestions): int
    {
        if ($totalQuestions <= 0) {
            return 0;
        }

        $configured = (int) ($test->questions_to_show ?? 0);
        if ($configured <= 0) {
            return $totalQuestions;
        }

        return min($configured, $totalQuestions);
    }

    private function getDisplayedQuestionsForUser(Test $test, string $userId, $allQuestions = null)
    {
        $questions = $allQuestions ?? $test->questions;

        $sequence = UserTestSequence::where('user_id', $userId)
            ->where('test_id', $test->id)
            ->where('test_type', 'exam')
            ->first();

        if ($sequence && is_array($sequence->question_sequence)) {
            $orderMap = array_flip($sequence->question_sequence);
            $questions = $questions->sortBy(function ($q) use ($orderMap) {
                return $orderMap[$q->id] ?? PHP_INT_MAX;
            })->values();
        }

        $limit = $this->resolveQuestionsToShowCount($test, $questions->count());

        if ($limit <= 0) {
            return collect();
        }

        return $questions->take($limit)->values();
    }
}
