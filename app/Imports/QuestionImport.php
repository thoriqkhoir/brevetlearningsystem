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
        $explanation = isset($row['explanation']) && trim((string) $row['explanation']) !== ''
            ? trim((string) $row['explanation'])
            : null;

        // Create the question
        $question = Question::create([
            'question_bank_id' => $this->questionBankId,
            'question_text' => $row['question'],
            'explanation' => $explanation,
            'question_type' => 'multiple_choice', // Default to multiple choice
        ]);

        $correctOption = strtoupper(trim((string) $row['correct_option']));
        $options = [];

        foreach (range('a', 'z') as $letter) {
            $key = "option_{$letter}";
            if (array_key_exists($key, $row) && $row[$key] !== null && trim((string) $row[$key]) !== '') {
                $options[] = [
                    'option_text' => trim((string) $row[$key]),
                    'is_correct' => $correctOption === strtoupper($letter),
                ];
            }
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

    public function prepareForValidation($data, $index)
    {
        $fields = ['question', 'correct_option', 'explanation', 'pembahasan'];
        foreach (range('a', 'z') as $letter) {
            $fields[] = "option_{$letter}";
        }

        foreach ($fields as $field) {
            if (array_key_exists($field, $data) && $data[$field] !== null) {
                $data[$field] = trim((string) $data[$field]);
            }
        }

        // Fallback alias: allow 'pembahasan' column when 'explanation' is not provided
        if ((!isset($data['explanation']) || $data['explanation'] === '') && isset($data['pembahasan']) && $data['pembahasan'] !== '') {
            $data['explanation'] = $data['pembahasan'];
        }

        return $data;
    }

    public function rules(): array
    {
        $rules = [
            'question' => 'required|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'correct_option' => ['required', 'string', 'regex:/^[A-Za-z]$/'],
            'explanation' => 'nullable|string',
        ];

        foreach (range('c', 'z') as $letter) {
            $rules["option_{$letter}"] = 'nullable|string';
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($validator->getData() as $rowIndex => $row) {
                if (!is_array($row)) {
                    continue;
                }

                $correct = strtoupper(trim((string) ($row['correct_option'] ?? '')));
                if ($correct === '' || !preg_match('/^[A-Z]$/', $correct)) {
                    continue;
                }

                $optionKey = 'option_' . strtolower($correct);
                $optionValue = isset($row[$optionKey]) ? trim((string) $row[$optionKey]) : '';

                if ($optionValue === '') {
                    $validator->errors()->add(
                        "{$rowIndex}.correct_option",
                        "Kolom {$optionKey} harus diisi karena dipilih sebagai correct_option ({$correct})."
                    );
                }
            }
        });
    }

    public function customValidationMessages()
    {
        return [
            'question.required' => 'Kolom question harus diisi.',
            'option_a.required' => 'Kolom option_a harus diisi.',
            'option_b.required' => 'Kolom option_b harus diisi.',
            'correct_option.required' => 'Kolom correct_option harus diisi.',
            'correct_option.regex' => 'Kolom correct_option harus berupa huruf opsi yang valid (misal A, B, C, D, E, ...).',
        ];
    }
}
