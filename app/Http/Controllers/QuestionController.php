<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Question;
use App\Imports\QuestionImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    public function index(Test $test)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id) {
            return redirect()->route('teacher.editTest', $test->id)
                ->with('error', 'Pilih bank soal terlebih dahulu untuk mengelola soal ujian.');
        }

        // Load questions dengan relasi yang diperlukan
        $questions = $test->questions()->with(['options'])->get();

        // Hitung statistik
        // Ambil attempts (submitted) untuk perhitungan agregat
        $submittedAttempts = $test->testAttempts()
            ->whereNotNull('submitted_at')
            ->get(['user_id', 'score', 'passed']);

        // Peserta lulus: hitung unik user_id yang memiliki attempt lulus
        $passedParticipants = $submittedAttempts
            ->where('passed', true)
            ->pluck('user_id')
            ->unique()
            ->count();

        // Total peserta dari relasi peserta ujian (test_users)
        $totalParticipants = $test->participants()->count();

        // Rata-rata nilai: 1 user mewakili 1 nilai terbaik (max score per user)
        $bestScores = $submittedAttempts
            ->groupBy('user_id')
            ->map(function ($attempts) {
                return (float) $attempts->max('score');
            })
            ->values();
        $averageBestScore = $bestScores->count() > 0 ? round($bestScores->avg(), 2) : 0;

        $statistics = [
            'average_score' => $averageBestScore,
            'difficulty_level' => $this->calculateDifficultyLevel($averageBestScore),
            'passed_participants' => $passedParticipants,
            'total_participants' => $totalParticipants,
        ];

        $effectiveQuestionsToShow = $questions->count() > 0
            ? min((int) ($test->questions_to_show ?? $questions->count()), $questions->count())
            : 0;

        return Inertia::render('Teacher/Test/Questions/Question', [
            'test' => $test->load(['participants.user', 'questionBank']),
            'questions' => $questions,
            'statistics' => $statistics,
            'questionDisplaySettings' => [
                'current' => $effectiveQuestionsToShow,
                'custom' => $test->questions_to_show,
                'max' => $questions->count(),
            ],
        ]);
    }

    public function create(Test $test)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id) {
            return redirect()->route('teacher.editTest', $test->id)
                ->with('error', 'Pilih bank soal terlebih dahulu untuk menambah soal.');
        }

        return Inertia::render('Teacher/Test/Questions/CreateQuestion', [
            'test' => $test->load('questionBank'),
        ]);
    }

    public function store(Request $request, Test $test)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id) {
            return redirect()->route('teacher.editTest', $test->id)
                ->with('error', 'Pilih bank soal terlebih dahulu untuk menambah soal.');
        }

        // If options are sent as JSON string (from FormData), decode before validation
        if ($request->has('options') && is_string($request->input('options'))) {
            $decoded = json_decode($request->input('options'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $request->merge(['options' => $decoded]);
            }
        }

        $validated = $request->validate([
            'question_text' => 'required|string',
            'question_type' => 'required|in:multiple_choice,true_false,short_answer',
            'options' => 'required_if:question_type,multiple_choice,true_false|array|min:2',
            'options.*.id' => 'nullable|string',
            'options.*.text' => 'required_with:options|string',
            'options.*.is_correct' => 'boolean',
            'options.*.delete_image' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Store image in storage/app/public/questions and keep relative path
            $imagePath = $request->file('image')->store('questions', 'public');
        }

        $question = Question::create([
            'question_bank_id' => $test->question_bank_id,
            'question_text' => $validated['question_text'],
            'question_type' => $validated['question_type'],
            'image_url' => $imagePath,
        ]);

        // Create options for multiple choice and true/false
        if (in_array($validated['question_type'], ['multiple_choice', 'true_false']) && isset($validated['options'])) {
            foreach ($validated['options'] as $index => $option) {
                $optionImagePath = null;

                // Handle option image upload
                if ($request->hasFile("option_image_{$index}")) {
                    $optionImagePath = $request->file("option_image_{$index}")->store('question_options', 'public');
                }

                $question->options()->create([
                    'option_text' => $option['text'],
                    'is_correct' => $option['is_correct'] ?? false,
                    'image_url' => $optionImagePath,
                ]);
            }
        }

        return redirect()->route('test.question.index', $test)
            ->with('success', 'Soal berhasil ditambahkan');
    }

    public function edit(Test $test, Question $question)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id || $question->question_bank_id !== $test->question_bank_id) {
            abort(404, 'Soal tidak ditemukan pada bank soal ujian ini.');
        }

        $question->load(['options']);

        return Inertia::render('Teacher/Test/Questions/EditQuestion', [
            'test' => $test->load('questionBank'),
            'question' => $question,
        ]);
    }

    public function update(Request $request, Test $test, Question $question)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id || $question->question_bank_id !== $test->question_bank_id) {
            abort(404, 'Soal tidak ditemukan pada bank soal ujian ini.');
        }

        // If options are sent as JSON string (from FormData), decode before validation
        if ($request->has('options') && is_string($request->input('options'))) {
            $decoded = json_decode($request->input('options'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $request->merge(['options' => $decoded]);
            }
        }

        $validated = $request->validate([
            'question_text' => 'required|string',
            'question_type' => 'required|in:multiple_choice,true_false,short_answer',
            'options' => 'required_if:question_type,multiple_choice,true_false|array|min:2',
            'options.*.id' => 'nullable|string',
            'options.*.text' => 'required_with:options|string',
            'options.*.is_correct' => 'boolean',
            'options.*.delete_image' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Handle image replacement if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($question->image_url) {
                Storage::disk('public')->delete($question->image_url);
            }
            $newPath = $request->file('image')->store('questions', 'public');
            $question->image_url = $newPath;
        }

        $question->update([
            'question_text' => $validated['question_text'],
            'question_type' => $validated['question_type'],
            'image_url' => $question->image_url,
        ]);

        // Update options untuk multiple choice dan true/false
        if (in_array($validated['question_type'], ['multiple_choice', 'true_false']) && isset($validated['options'])) {
            $existingOptionIds = [];

            foreach ($validated['options'] as $index => $optionData) {
                $optionImagePath = null;
                $optionId = $optionData['id'] ?? null;

                // Cek apakah ada file gambar baru yang diupload
                $hasNewImage = $request->hasFile("option_image_{$index}");
                // Cek apakah user ingin menghapus gambar
                $shouldDeleteImage = isset($optionData['delete_image']) && $optionData['delete_image'] === true;

                if ($optionId && !empty($optionId)) {
                    // Update opsi yang sudah ada
                    $existingOption = $question->options()->find($optionId);

                    if ($existingOption) {
                        $existingOptionIds[] = $optionId;

                        // Jika user ingin menghapus gambar
                        if ($shouldDeleteImage) {
                            if ($existingOption->image_url) {
                                Storage::disk('public')->delete($existingOption->image_url);
                            }
                            $existingOption->image_url = null;
                        }
                        // Jika ada gambar baru, hapus gambar lama dan simpan yang baru
                        elseif ($hasNewImage) {
                            if ($existingOption->image_url) {
                                Storage::disk('public')->delete($existingOption->image_url);
                            }
                            $optionImagePath = $request->file("option_image_{$index}")->store('question_options', 'public');
                            $existingOption->image_url = $optionImagePath;
                        }

                        $existingOption->option_text = $optionData['text'];
                        $existingOption->is_correct = $optionData['is_correct'] ?? false;
                        $existingOption->save();
                    }
                } else {
                    // Buat opsi baru
                    if ($hasNewImage) {
                        $optionImagePath = $request->file("option_image_{$index}")->store('question_options', 'public');
                    }

                    $newOption = $question->options()->create([
                        'option_text' => $optionData['text'],
                        'is_correct' => $optionData['is_correct'] ?? false,
                        'image_url' => $optionImagePath,
                    ]);

                    $existingOptionIds[] = $newOption->id;
                }
            }

            // Hapus opsi yang tidak ada dalam request (opsi yang dihapus user)
            $optionsToDelete = $question->options()->whereNotIn('id', $existingOptionIds)->get();
            foreach ($optionsToDelete as $optionToDelete) {
                if ($optionToDelete->image_url) {
                    Storage::disk('public')->delete($optionToDelete->image_url);
                }
                $optionToDelete->delete();
            }
        } elseif ($validated['question_type'] === 'short_answer') {
            // Hapus options jika berubah menjadi short answer
            foreach ($question->options as $oldOption) {
                if ($oldOption->image_url) {
                    Storage::disk('public')->delete($oldOption->image_url);
                }
            }
            $question->options()->delete();
        }

        return redirect()->route('test.question.index', $test)
            ->with('success', 'Soal berhasil diperbarui');
    }

    public function destroy(Test $test, Question $question)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id || $question->question_bank_id !== $test->question_bank_id) {
            abort(404, 'Soal tidak ditemukan pada bank soal ujian ini.');
        }

        // Delete associated image file if exists
        if ($question->image_url) {
            Storage::disk('public')->delete($question->image_url);
        }
        foreach ($question->options as $option) {
            if ($option->image_url) {
                Storage::disk('public')->delete($option->image_url);
            }
        }
        $question->delete();
        $this->syncQuestionsToShowWithinLimit($test);

        return redirect()->route('test.question.index', $test)
            ->with('success', 'Soal berhasil dihapus');
    }

    public function updateQuestionsToShow(Request $request, Test $test)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $totalQuestions = $test->questions()->count();

        if ($totalQuestions === 0) {
            return back()->with('error', 'Belum ada soal. Tambahkan soal terlebih dahulu.');
        }

        $validated = $request->validate([
            'questions_to_show' => ['required', 'integer', 'min:1', 'max:' . $totalQuestions],
        ], [
            'questions_to_show.required' => 'Jumlah soal yang ditampilkan harus diisi.',
            'questions_to_show.integer' => 'Jumlah soal harus berupa angka bulat.',
            'questions_to_show.min' => 'Jumlah soal minimal 1.',
            'questions_to_show.max' => 'Jumlah soal tidak boleh melebihi total soal yang tersedia.',
        ]);

        $test->update([
            'questions_to_show' => (int) $validated['questions_to_show'],
        ]);

        return back()->with('success', 'Jumlah soal yang ditampilkan berhasil diperbarui.');
    }

    private function syncQuestionsToShowWithinLimit(Test $test): void
    {
        $totalQuestions = $test->questions()->count();

        if ($totalQuestions === 0) {
            if (!is_null($test->questions_to_show)) {
                $test->update(['questions_to_show' => null]);
            }
            return;
        }

        if (!is_null($test->questions_to_show) && (int) $test->questions_to_show > $totalQuestions) {
            $test->update(['questions_to_show' => $totalQuestions]);
        }
    }

    private function calculateDifficultyLevel($averageScore)
    {
        if (empty($averageScore) || !is_numeric($averageScore)) {
            return 'Belum ada data';
        }

        if ($averageScore >= 80) {
            return 'Mudah';
        } elseif ($averageScore >= 60) {
            return 'Sedang';
        } else {
            return 'Sulit';
        }
    }

    public function import(Request $request, Test $test)
    {
        if ($test->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$test->question_bank_id) {
            return redirect()->route('teacher.editTest', $test->id)
                ->with('error', 'Pilih bank soal terlebih dahulu untuk import soal.');
        }

        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
        ], [
            'file.required' => 'File Excel harus dipilih.',
            'file.mimes' => 'File harus berformat Excel (.xlsx, .xls, .csv).',
        ]);

        try {
            Excel::import(new QuestionImport($test->question_bank_id), $request->file('file'));

            return redirect()
                ->route('test.question.index', $test)
                ->with('success', 'Soal berhasil diimport!');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errorMessages = [];

            foreach ($failures as $failure) {
                $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
            }

            return redirect()
                ->back()
                ->with('error', 'Import gagal! ' . implode(' | ', array_slice($errorMessages, 0, 5)));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Import gagal! ' . $e->getMessage());
        }
    }

    // public function downloadTemplateQuestion()
    // {
    //     $filePath = public_path('templates/template_import_soal.xlsx');

    //     if (!file_exists($filePath)) {
    //         return redirect()->back()->with('error', 'File template tidak ditemukan.');
    //     }

    //     return response()->download($filePath, 'template_import_soal.xlsx');
    // }

}
