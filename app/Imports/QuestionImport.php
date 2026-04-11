<?php

namespace App\Imports;

use App\Models\Question;
use App\Models\QuestionOption;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class QuestionImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
{
    use Importable;

    protected $questionBankId;

    public function __construct($questionBankId)
    {
        $this->questionBankId = $questionBankId;
    }

    public function model(array $row)
    {
        // Create the question
        $question = Question::create([
            'question_bank_id' => $this->questionBankId,
            'question_text' => $row['question'],
            'question_type' => 'multiple_choice', // Default to multiple choice
        ]);

        // Create options
        $options = [
            ['option_text' => $row['option_a'], 'is_correct' => strtoupper($row['correct_option']) === 'A'],
            ['option_text' => $row['option_b'], 'is_correct' => strtoupper($row['correct_option']) === 'B'],
        ];

        // Add option C if exists
        if (!empty($row['option_c'])) {
            $options[] = ['option_text' => $row['option_c'], 'is_correct' => strtoupper($row['correct_option']) === 'C'];
        }

        // Add option D if exists
        if (!empty($row['option_d'])) {
            $options[] = ['option_text' => $row['option_d'], 'is_correct' => strtoupper($row['correct_option']) === 'D'];
        }

        // Create the options
        foreach ($options as $option) {
            QuestionOption::create([
                'question_id' => $question->id,
                'option_text' => $option['option_text'],
                'is_correct' => $option['is_correct'],
            ]);
        }

        return $question;
    }

    public function rules(): array
    {
        return [
            'question' => 'required|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'option_c' => 'nullable|string',
            'option_d' => 'nullable|string',
            'correct_option' => 'required|in:A,B,C,D,a,b,c,d',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'question.required' => 'Kolom question harus diisi.',
            'option_a.required' => 'Kolom option_a harus diisi.',
            'option_b.required' => 'Kolom option_b harus diisi.',
            'correct_option.required' => 'Kolom correct_option harus diisi.',
            'correct_option.in' => 'Kolom correct_option harus berisi A, B, C, atau D.',
        ];
    }
}
