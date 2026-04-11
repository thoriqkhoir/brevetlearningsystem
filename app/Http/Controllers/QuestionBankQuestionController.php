<?php

namespace App\Http\Controllers;

use App\Imports\QuestionImport;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class QuestionBankQuestionController extends Controller
{
    public function index(QuestionBank $questionBank)
    {
        $this->authorizeBank($questionBank);

        $questions = $questionBank->questions()->with('options')->get();
        $testsUsingBank = $questionBank->tests()->orderBy('title')->get(['id', 'title', 'code']);

        return Inertia::render('Teacher/Test/Questions/Question', [
            'mode' => 'bank',
            'test' => [
                'id' => $questionBank->id,
                'title' => $questionBank->name,
                'questions_to_show' => null,
                'question_bank' => [
                    'id' => $questionBank->id,
                    'name' => $questionBank->name,
                ],
            ],
            'questionBank' => [
                'id' => $questionBank->id,
                'name' => $questionBank->name,
                'description' => $questionBank->description,
            ],
            'testsUsingBank' => $testsUsingBank,
            'questions' => $questions,
            'statistics' => [],
            'questionDisplaySettings' => null,
        ]);
    }

    public function create(QuestionBank $questionBank)
    {
        $this->authorizeBank($questionBank);

        return Inertia::render('Teacher/Test/Questions/CreateQuestion', [
            'mode' => 'bank',
            'test' => [
                'id' => $questionBank->id,
                'title' => $questionBank->name,
                'question_bank' => [
                    'id' => $questionBank->id,
                    'name' => $questionBank->name,
                ],
            ],
            'questionBank' => [
                'id' => $questionBank->id,
                'name' => $questionBank->name,
                'description' => $questionBank->description,
            ],
        ]);
    }

    public function store(Request $request, QuestionBank $questionBank)
    {
        $this->authorizeBank($questionBank);

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
            $imagePath = $request->file('image')->store('questions', 'public');
        }

        $question = Question::create([
            'question_bank_id' => $questionBank->id,
            'question_text' => $validated['question_text'],
            'question_type' => $validated['question_type'],
            'image_url' => $imagePath,
        ]);

        if (in_array($validated['question_type'], ['multiple_choice', 'true_false']) && isset($validated['options'])) {
            foreach ($validated['options'] as $index => $option) {
                $optionImagePath = null;

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

        return redirect()
            ->route('teacher.questionBankQuestions.index', $questionBank->id)
            ->with('success', 'Soal bank berhasil ditambahkan.');
    }

    public function edit(QuestionBank $questionBank, Question $question)
    {
        $this->authorizeBank($questionBank);
        $this->authorizeQuestionInBank($questionBank, $question);

        $question->load('options');

        return Inertia::render('Teacher/Test/Questions/EditQuestion', [
            'mode' => 'bank',
            'test' => [
                'id' => $questionBank->id,
                'title' => $questionBank->name,
                'question_bank' => [
                    'id' => $questionBank->id,
                    'name' => $questionBank->name,
                ],
            ],
            'questionBank' => [
                'id' => $questionBank->id,
                'name' => $questionBank->name,
                'description' => $questionBank->description,
            ],
            'question' => $question,
        ]);
    }

    public function update(Request $request, QuestionBank $questionBank, Question $question)
    {
        $this->authorizeBank($questionBank);
        $this->authorizeQuestionInBank($questionBank, $question);

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

        if ($request->hasFile('image')) {
            if ($question->image_url) {
                Storage::disk('public')->delete($question->image_url);
            }
            $question->image_url = $request->file('image')->store('questions', 'public');
        }

        $question->update([
            'question_text' => $validated['question_text'],
            'question_type' => $validated['question_type'],
            'image_url' => $question->image_url,
        ]);

        if (in_array($validated['question_type'], ['multiple_choice', 'true_false']) && isset($validated['options'])) {
            $existingOptionIds = [];

            foreach ($validated['options'] as $index => $optionData) {
                $optionImagePath = null;
                $optionId = $optionData['id'] ?? null;
                $hasNewImage = $request->hasFile("option_image_{$index}");
                $shouldDeleteImage = isset($optionData['delete_image']) && $optionData['delete_image'] === true;

                if ($optionId && !empty($optionId)) {
                    $existingOption = $question->options()->find($optionId);

                    if ($existingOption) {
                        $existingOptionIds[] = $optionId;

                        if ($shouldDeleteImage) {
                            if ($existingOption->image_url) {
                                Storage::disk('public')->delete($existingOption->image_url);
                            }
                            $existingOption->image_url = null;
                        } elseif ($hasNewImage) {
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

            $optionsToDelete = $question->options()->whereNotIn('id', $existingOptionIds)->get();
            foreach ($optionsToDelete as $optionToDelete) {
                if ($optionToDelete->image_url) {
                    Storage::disk('public')->delete($optionToDelete->image_url);
                }
                $optionToDelete->delete();
            }
        } elseif ($validated['question_type'] === 'short_answer') {
            foreach ($question->options as $oldOption) {
                if ($oldOption->image_url) {
                    Storage::disk('public')->delete($oldOption->image_url);
                }
            }
            $question->options()->delete();
        }

        return redirect()
            ->route('teacher.questionBankQuestions.index', $questionBank->id)
            ->with('success', 'Soal bank berhasil diperbarui.');
    }

    public function destroy(QuestionBank $questionBank, Question $question)
    {
        $this->authorizeBank($questionBank);
        $this->authorizeQuestionInBank($questionBank, $question);

        if ($question->image_url) {
            Storage::disk('public')->delete($question->image_url);
        }

        foreach ($question->options as $option) {
            if ($option->image_url) {
                Storage::disk('public')->delete($option->image_url);
            }
        }

        $question->delete();

        return redirect()
            ->route('teacher.questionBankQuestions.index', $questionBank->id)
            ->with('success', 'Soal bank berhasil dihapus.');
    }

    public function import(Request $request, QuestionBank $questionBank)
    {
        $this->authorizeBank($questionBank);

        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
        ], [
            'file.required' => 'File Excel harus dipilih.',
            'file.mimes' => 'File harus berformat Excel (.xlsx, .xls, .csv).',
        ]);

        try {
            Excel::import(new QuestionImport($questionBank->id), $request->file('file'));

            return redirect()
                ->route('teacher.questionBankQuestions.index', $questionBank->id)
                ->with('success', 'Soal bank berhasil diimport.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errorMessages = [];

            foreach ($failures as $failure) {
                $errorMessages[] = 'Baris ' . $failure->row() . ': ' . implode(', ', $failure->errors());
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

    private function authorizeBank(QuestionBank $questionBank): void
    {
        if ($questionBank->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
    }

    private function authorizeQuestionInBank(QuestionBank $questionBank, Question $question): void
    {
        if ($question->question_bank_id !== $questionBank->id) {
            abort(404, 'Soal tidak ditemukan pada bank soal ini.');
        }
    }
}
