<?php

namespace App\Imports;

use App\Models\Course;
use App\Models\CourseSchedule;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class CourseScheduleImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
{
    use Importable;

    public function __construct(private readonly Course $course) {}

    public function model(array $row)
    {
        $scheduledAt = $this->normalizeDateTime($row['scheduled_at'] ?? null);

        if (!$scheduledAt) {
            throw new \InvalidArgumentException('Kolom scheduled_at harus berisi tanggal dan jam yang valid.');
        }

        CourseSchedule::create([
            'course_id' => $this->course->id,
            'title' => trim((string) ($row['title'] ?? '')),
            'scheduled_at' => $scheduledAt,
            'zoom_link' => !empty($row['zoom_link']) ? trim((string) $row['zoom_link']) : null,
        ]);

        return null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'scheduled_at' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!$this->normalizeDateTime($value)) {
                        $fail('Kolom scheduled_at harus berisi tanggal dan jam yang valid.');
                    }
                },
            ],
            'zoom_link' => 'nullable|url|max:2048',
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
}
