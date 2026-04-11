<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bupot;
use App\Models\Test;
use App\Models\TestUser;
use App\Models\Invoice;
use App\Models\Other;
use App\Models\Retur;
use App\Models\ReturOther;
use App\Models\Spt;
use App\Models\User;
use App\Models\TestAttempt;
use App\Models\QuestionBank;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TestParticipantsExport;

class TestController extends Controller
{
    public function index()
    {
        $tests = Test::with('questionBank')
            ->where('teacher_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $user = Auth::user();
        return Inertia::render('Teacher/Test/Test', [
            'tests' => $tests,
            'user' => $user,
        ]);
    }

    public function create()
    {
        $tests = Test::where('teacher_id', Auth::id())->get();
        $questionBanks = QuestionBank::where('teacher_id', Auth::id())
            ->withCount('questions')
            ->orderBy('name')
            ->get(['id', 'name', 'is_active']);
        $user = Auth::user();
        return Inertia::render('Teacher/Test/FormCreateTest', [
            'tests' => $tests,
            'questionBanks' => $questionBanks,
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid',
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:tests,code',
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
            // start_date berisi timestamp lengkap "Y-m-d H:i:s"
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $testData = [
            'id' => $validated['id'],
            'teacher_id' => Auth::id(),
            'title' => $validated['title'],
            'code' => $validated['code'],
            'description' => $validated['description'],
            'duration' => $validated['duration'] ?? 0,
            'passing_score' => $validated['passing_score'] ?? 0,
            'question_bank_id' => $validated['question_bank_id'] ?? null,
            'questions_to_show' => $validated['questions_to_show'] ?? null,
            // start_date diisi gabungan tanggal+jam
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
        ];

        Test::create($testData);

        return redirect()->route('teacher.tests')->with('success', 'Kelas berhasil ditambahkan!');
    }

    public function show($id)
    {
        $test = Test::with(['questions', 'questionBank'])->findOrFail($id);
        $participants = $test->participants()
            ->with(['user', 'testResults'])
            ->get()
            ->map(function ($participant) {
                $averageScore = null;
                if ($participant->testResults && $participant->testResults->count() > 0) {
                    $validScores = $participant->testResults->whereNotNull('score')->pluck('score');

                    if ($validScores->count() > 0) {
                        $averageScore = round($validScores->avg(), 2);
                    }
                }

                $participant->average_score = $averageScore;

                // Best score from test_attempts (only submitted attempts)
                $bestScore = TestAttempt::where('test_id', $participant->test_id)
                    ->where('user_id', $participant->user_id)
                    ->whereNotNull('submitted_at')
                    ->max('score');

                $participant->best_score = $bestScore !== null ? (int) $bestScore : null;
                return $participant;
            });

        return Inertia::render('Teacher/Test/DetailTest', [
            'test' => $test,
            'participants' => $participants,
        ]);
    }

    public function detail($id)
    {
        $test = Test::with(['questions', 'questionBank'])->findOrFail($id);
        $participants = $test->participants()
            ->with(['user', 'testResults'])
            ->get()
            ->map(function ($participant) {
                $averageScore = null;
                if ($participant->testResults && $participant->testResults->count() > 0) {
                    $validScores = $participant->testResults->whereNotNull('score')->pluck('score');

                    if ($validScores->count() > 0) {
                        $averageScore = round($validScores->avg(), 2);
                    }
                }

                $participant->average_score = $averageScore;

                // Best score from test_attempts (only submitted attempts)
                $bestScore = TestAttempt::where('test_id', $participant->test_id)
                    ->where('user_id', $participant->user_id)
                    ->whereNotNull('submitted_at')
                    ->max('score');

                $participant->best_score = $bestScore !== null ? (int) $bestScore : null;
                return $participant;
            });

        return Inertia::render('Teacher/Test/DetailTest', [
            'test' => $test,
            'participants' => $participants,
        ]);
    }

    public function showParticipant($testId, $participantId)
    {
        $test = Test::findOrFail($testId);
        $participant = $test->participants()
            ->with(['user', 'testResults'])
            ->findOrFail($participantId);

        $testResults = $participant->testResults;

        $invoiceIds = $testResults->whereNotNull('invoice_id')->pluck('invoice_id')->toArray();
        $fakturs = Invoice::whereIn('id', $invoiceIds)->get();

        $returIds = $testResults->whereNotNull('retur_id')->pluck('retur_id')->toArray();
        $returs = Retur::with('invoice')->whereIn('id', $returIds)->get();

        $otherIds = $testResults->whereNotNull('other_id')->pluck('other_id')->toArray();
        $others = Other::whereIn('id', $otherIds)->get();

        $returOtherIds = $testResults->whereNotNull('retur_other_id')->pluck('retur_other_id')->toArray();
        $returOthers = ReturOther::with('other')->whereIn('id', $returOtherIds)->get();

        $bupotIds = $testResults->whereNotNull('bupot_id')->pluck('bupot_id')->toArray();
        $bupots = Bupot::with('object')->whereIn('id', $bupotIds)->get();

        $sptIds = $testResults->whereNotNull('spt_id')->pluck('spt_id')->toArray();
        $spts = Spt::whereIn('id', $sptIds)->get();

        $averageScore = null;
        if ($testResults->count() > 0) {
            $validScores = $testResults->whereNotNull('score')->pluck('score');
            if ($validScores->count() > 0) {
                $averageScore = round($validScores->avg(), 2);
            }
        }

        // Best score from test_attempts (only submitted attempts)
        $bestScore = TestAttempt::where('test_id', $test->id)
            ->where('user_id', $participant->user_id)
            ->whereNotNull('submitted_at')
            ->max('score');
        $bestScore = $bestScore !== null ? (int) $bestScore : null;

        // Fetch attempt history for this user on this test
        $attempts = TestAttempt::where('test_id', $test->id)
            ->where('user_id', $participant->user_id)
            ->orderByDesc('started_at')
            ->get(['id', 'test_type', 'score', 'passed', 'started_at', 'submitted_at', 'completed_at', 'created_at', 'updated_at']);

        return Inertia::render('Teacher/Test/DetailParticipant', [
            'test' => $test,
            'participant' => $participant,
            'fakturs' => $fakturs,
            'returs' => $returs,
            'others' => $others,
            'returOthers' => $returOthers,
            'bupots' => $bupots,
            'spts' => $spts,
            'testResults' => $testResults,
            'averageScore' => $averageScore,
            'bestScore' => $bestScore,
            'attempts' => $attempts,
        ]);
    }

    public function resultAttempt($id, $attemptId)
    {
        $teacherId = Auth::id();
        $test = Test::with(['questions.options'])->where('teacher_id', $teacherId)->findOrFail($id);

        // Ensure attempt belongs to this test (any user)
        $attempt = TestAttempt::where('id', $attemptId)
            ->where('test_id', $test->id)
            ->firstOrFail();

        // Build review with user sequence if exists (sequence is per user)
        $sequence = \App\Models\UserTestSequence::where('user_id', $attempt->user_id)
            ->where('test_id', $test->id)
            ->where('test_type', 'exam')
            ->first();
        $answers = $attempt->answers()->get()->keyBy('question_id');
        $questions = $test->questions;
        if ($sequence && is_array($sequence->question_sequence)) {
            $orderMap = array_flip($sequence->question_sequence);
            $questions = $questions->sortBy(function ($q) use ($orderMap) {
                return $orderMap[$q->id] ?? PHP_INT_MAX;
            })->values();
        }
        $effectiveQuestionsToShow = $questions->count() > 0
            ? min((int) ($test->questions_to_show ?? $questions->count()), $questions->count())
            : 0;
        $questions = $effectiveQuestionsToShow > 0
            ? $questions->take($effectiveQuestionsToShow)->values()
            : collect();
        $review = $questions->map(function ($q) use ($answers, $sequence) {
            $options = $q->options;
            if ($sequence && is_array($sequence->option_sequences) && isset($sequence->option_sequences[$q->id]) && $options) {
                $seq = $sequence->option_sequences[$q->id];
                $optOrder = array_flip($seq);
                $options = $options->sortBy(function ($o) use ($optOrder) {
                    return $optOrder[$o->id] ?? PHP_INT_MAX;
                })->values();
            }
            $ans = $answers->get($q->id);
            $selectedOptionId = $ans?->answer;
            $correctOption = $options?->firstWhere('is_correct', true);
            return [
                'id' => $q->id,
                'order_no' => null,
                'question_text' => $q->question_text,
                'question_type' => $q->question_type,
                'image_url' => $q->image_url ?? null,
                'selected' => $q->question_type === 'short_answer' ? ($ans?->answer ?? null) : $selectedOptionId,
                'is_correct' => $ans?->is_correct ?? null,
                'correct_option_id' => $correctOption?->id,
                'correct_option_text' => $correctOption?->option_text,
                'options' => $options?->map(function ($o) {
                    return ['id' => $o->id, 'option_text' => $o->option_text, 'is_correct' => (bool) $o->is_correct, 'image_url' => $o->image_url ?? null];
                }),
            ];
        });

        // Also load participant info (teacher context) for header display
        $participant = \App\Models\TestUser::where('test_id', $test->id)
            ->where('user_id', $attempt->user_id)
            ->with('user')
            ->first();

        return Inertia::render('Teacher/Test/Result', [
            'test' => $test,
            'attempt' => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'passed' => (bool) $attempt->passed,
                'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
            ],
            'review' => $review,
            'participant' => $participant,
        ]);
    }

    public function edit($id)
    {
        $test = Test::findOrFail($id);
        $questionBanks = QuestionBank::where('teacher_id', Auth::id())
            ->withCount('questions')
            ->orderBy('name')
            ->get(['id', 'name', 'is_active']);

        return Inertia::render('Teacher/Test/FormEditTest', [
            'test' => $test,
            'questionBanks' => $questionBanks,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:tests,code,' . $id,
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
            // start_date adalah timestamp lengkap
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $test = Test::findOrFail($id);

        $test->update($validated);

        return redirect()->route('teacher.showTest', $test->id)->with('success', 'Test berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $test = Test::findOrFail($id);
        $test->delete();

        return redirect()->route('teacher.tests')->with('success', 'Test berhasil dihapus!');
    }

    public function removeParticipant($testId, $participantId)
    {
        $test = Test::findOrFail($testId);

        if ($test->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $participant = TestUser::findOrFail($participantId);

        if ($participant->test_id !== $test->id) {
            return back()->with('error', 'Participant not found in this test');
        }

        $participant->testResults()->delete();

        $participant->delete();

        return back()->with('success', 'Peserta berhasil dihapus dari kelas');
    }

    public function searchUsers(Request $request)
    {
        $search = $request->get('search');
        $testId = $request->get('test_id');

        if (strlen($search) < 2) {
            return response()->json([]);
        }

        // Get existing participant user IDs for this test
        $existingParticipantIds = TestUser::where('test_id', $testId)
            ->pluck('user_id')
            ->toArray();

        // Search users with role 'pengguna' only, excluding existing participants
        $users = User::where('role', 'pengguna')
            ->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%');
            })
            ->whereNotIn('id', $existingParticipantIds)
            ->limit(10)
            ->get(['id', 'name', 'email']);

        // Return JSON response, bukan Inertia render
        return response()->json([
            'searchResults' => $users
        ]);
    }

    public function addParticipant(Request $request, $testId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $test = Test::findOrFail($testId);

        // Verify test ownership
        if ($test->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $user = User::findOrFail($request->user_id);

        // Verify user role
        if ($user->role !== 'pengguna') {
            return back()->with('error', 'Hanya pengguna dengan role "pengguna" yang dapat ditambahkan');
        }

        // Check if user is already a participant
        $existingParticipant = TestUser::where('test_id', $testId)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingParticipant) {
            return back()->with('error', 'Pengguna sudah terdaftar di kelas ini');
        }

        // Add participant
        TestUser::create([
            'user_id' => $request->user_id,
            'test_id' => $testId,
        ]);

        return back()->with('success', $user->name . ' berhasil ditambahkan ke kelas');
    }

    /**
     * Export participants to Excel with columns: No, Nama, Email, Nilai Terbaik, Feedback
     */
    public function exportParticipants($id)
    {
        $test = Test::findOrFail($id);
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $fileName = 'peserta_ujian_' . preg_replace('/[^A-Za-z0-9_-]/', '_', $test->title ?? 'test') . '.xlsx';
        return Excel::download(new TestParticipantsExport($test), $fileName);
    }

    /**
     * Duplicate a Test along with its questions and options.
     */
    public function duplicate($id)
    {
        $original = Test::with(['questions.options'])->findOrFail($id);

        // Authorization: ensure the test belongs to the current teacher
        if ($original->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        // Enforce max test limit if present on user
        $user = Auth::user();
        if (!empty($user->max_test)) {
            $currentCount = Test::where('teacher_id', $user->id)->count();
            if ($currentCount >= (int) $user->max_test) {
                return back()->with('error', 'Jumlah Ujian sudah mencapai batas maksimal');
            }
        }

        // Generate a unique 8-char alphanumeric code (same style as form create)
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $length = 8;
        $maxAttempts = 100;
        $newCode = null;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $candidate = '';
            for ($i = 0; $i < $length; $i++) {
                $candidate .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }

            if ($candidate !== $original->code && !Test::where('code', $candidate)->exists()) {
                $newCode = $candidate;
                break;
            }
        }

        if (!$newCode) {
            // Fallback with timestamp to guarantee uniqueness
            $newCode = substr(bin2hex(random_bytes(6)), 0, 8);
            if (Test::where('code', $newCode)->exists()) {
                $newCode .= substr((string) time(), -2);
            }
        }

        // Prepare new Test data
        $newTest = Test::create([
            'teacher_id'    => $original->teacher_id,
            'question_bank_id' => $original->question_bank_id,
            'title'         => $original->title . ' (Salinan)',
            'code'          => $newCode,
            'description'   => $original->description,
            'duration'      => $original->duration,
            'passing_score' => $original->passing_score,
            'questions_to_show' => $original->questions_to_show,
            'start_date'    => $original->start_date,
            'end_date'      => $original->end_date,
        ]);

        return redirect()->route('teacher.tests')->with('success', 'Ujian berhasil diduplikasi.');
    }

    public function updateShowScore(Request $request, $id)
    {
        $validated = $request->validate([
            'show_score' => 'required|boolean',
        ]);

        $test = Test::findOrFail($id);

        // Pastikan hanya teacher yang membuat test yang bisa update
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $test->update([
            'show_score' => $validated['show_score']
        ]);

        return back()->with('success', 'Status tampilan nilai berhasil diubah!');
    }
}
