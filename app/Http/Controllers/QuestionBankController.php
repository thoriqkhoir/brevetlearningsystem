<?php

namespace App\Http\Controllers;

use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class QuestionBankController extends Controller
{
    public function index()
    {
        $questionBanks = QuestionBank::where('teacher_id', Auth::id())
            ->withCount('tests')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Teacher/QuestionBank/QuestionBank', [
            'questionBanks' => $questionBanks,
        ]);
    }

    public function create()
    {
        return Inertia::render('Teacher/QuestionBank/FormCreateQuestionBank');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('question_banks', 'name')->where(
                    fn($query) => $query->where('teacher_id', Auth::id())
                ),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        QuestionBank::create([
            'teacher_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('teacher.questionBanks')
            ->with('success', 'Bank soal berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $questionBank = QuestionBank::where('teacher_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Teacher/QuestionBank/FormEditQuestionBank', [
            'questionBank' => $questionBank,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $questionBank = QuestionBank::where('teacher_id', Auth::id())
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('question_banks', 'name')
                    ->ignore($questionBank->id)
                    ->where(fn($query) => $query->where('teacher_id', Auth::id())),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $questionBank->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('teacher.questionBanks')
            ->with('success', 'Bank soal berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $questionBank = QuestionBank::where('teacher_id', Auth::id())
            ->withCount('tests')
            ->findOrFail($id);

        if ($questionBank->tests_count > 0) {
            return back()->with('error', 'Bank soal tidak bisa dihapus karena masih dipakai oleh ujian.');
        }

        $questionBank->delete();

        return redirect()
            ->route('teacher.questionBanks')
            ->with('success', 'Bank soal berhasil dihapus.');
    }
}
