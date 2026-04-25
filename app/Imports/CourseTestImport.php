<?php

namespace App\Imports;

use App\Models\Course;
use App\Models\CourseTest;
use App\Models\QuestionBank;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class CourseTestImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
{
    use Importable;

    public function __construct(private readonly Course $course) {}

    public function model(array $row)
    {
        $questionBankName = trim((string) ($row['question_bank_name'] ?? ''));
        $questionBank = $this->resolveQuestionBankByName($questionBankName);

        if (!$questionBank) {
            throw new \InvalidArgumentException('Nama question bank tidak ditemukan untuk pengajar ini.');
        }

        $startDate = $this->normalizeDateTime($row['start_date'] ?? null);
        $endDate = $this->normalizeDateTime($row['end_date'] ?? null);

        if (!$startDate && !empty($row['start_date'])) {
            throw new \InvalidArgumentException('Kolom start_date harus berisi tanggal dan jam yang valid.');
        }

        if (!$endDate && !empty($row['end_date'])) {
            throw new \InvalidArgumentException('Kolom end_date harus berisi tanggal dan jam yang valid.');
        }

        if (!$startDate && $endDate) {
            throw new \InvalidArgumentException('Tanggal selesai ujian membutuhkan tanggal mulai.');
        }

        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);

            if ($start->greaterThan($end)) {
                throw new \InvalidArgumentException('Tanggal selesai ujian tidak boleh sebelum tanggal mulai.');
            }
        }

        $questionsToShow = $this->normalizeInteger($row['questions_to_show'] ?? null);

        if ($questionsToShow !== null && $questionsToShow > (int) $questionBank->questions_count) {
            throw new \InvalidArgumentException('Jumlah soal ditampilkan tidak boleh melebihi total soal pada bank (' . $questionBank->questions_count . ').');
        }

        $courseStart = !empty($this->course->start_date) ? Carbon::parse($this->course->start_date) : null;
        $courseEnd = !empty($this->course->end_date) ? Carbon::parse($this->course->end_date) : null;

        if ($courseStart && $startDate && Carbon::parse($startDate)->lt($courseStart)) {
            throw new \InvalidArgumentException('Waktu mulai ujian tidak boleh sebelum tanggal mulai kelas.');
        }

        if ($courseEnd && $endDate && Carbon::parse($endDate)->gt($courseEnd)) {
            throw new \InvalidArgumentException('Waktu selesai ujian tidak boleh melebihi tanggal selesai kelas.');
        }

        CourseTest::create([
            'course_id' => $this->course->id,
            'question_bank_id' => $questionBank->id,
            'title' => trim((string) ($row['title'] ?? '')),
            'description' => !empty($row['description']) ? trim((string) $row['description']) : null,
            'duration' => $this->normalizeInteger($row['duration'] ?? null) ?? 0,
            'passing_score' => $this->normalizeInteger($row['passing_score'] ?? null) ?? 0,
            'questions_to_show' => $questionsToShow,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'show_score' => $this->normalizeBoolean($row['show_score'] ?? null),
        ]);

        return null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'question_bank_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $name = trim((string) $value);

                    if ($name === '') {
                        $fail('Nama question bank wajib diisi.');

                        return;
                    }

                    $total = QuestionBank::query()
                        ->where('teacher_id', $this->course->teacher_id)
                        ->whereRaw('LOWER(name) = ?', [Str::lower($name)])
                        ->count();

                    if ($total === 0) {
                        $fail('Warning: Nama question bank tidak ditemukan.');

                        return;
                    }

                    if ($total > 1) {
                        $fail('Warning: Nama question bank duplikat. Gunakan nama question bank yang unik.');
                    }
                },
            ],
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'questions_to_show' => 'nullable|integer|min:1',
            'start_date' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value === null || $value === '') {
                        return;
                    }

                    if (!$this->normalizeDateTime($value)) {
                        $fail('Kolom start_date harus berisi tanggal dan jam yang valid.');
                    }
                },
            ],
            'end_date' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value === null || $value === '') {
                        return;
                    }

                    if (!$this->normalizeDateTime($value)) {
                        $fail('Kolom end_date harus berisi tanggal dan jam yang valid.');
                    }
                },
            ],
            'show_score' => 'nullable',
        ];
    }

    private function normalizeDateTime(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject($value))
                    ->format('Y-m-d H:i:s');
            }

            return Carbon::parse((string) $value)->format('Y-m-d H:i:s');
        } catch (\Throwable) {
            return null;
        }
    }

    private function normalizeInteger(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }

    private function normalizeBoolean(mixed $value): bool
    {
        if ($value === null || $value === '') {
            return true;
        }

        if (is_bool($value)) {
            return $value;
        }

        $normalized = Str::lower(trim((string) $value));

        return in_array($normalized, ['1', 'true', 'yes', 'y', 'on', 'ya'], true);
    }

    private function resolveQuestionBankByName(string $questionBankName): ?QuestionBank
    {
        if ($questionBankName === '') {
            return null;
        }

        $query = QuestionBank::query()
            ->where('teacher_id', $this->course->teacher_id)
            ->whereRaw('LOWER(name) = ?', [Str::lower($questionBankName)])
            ->withCount('questions');

        $total = (clone $query)->count();

        if ($total > 1) {
            throw new \InvalidArgumentException('Nama question bank duplikat. Gunakan nama question bank yang unik.');
        }

        return $query->first();
    }
}
