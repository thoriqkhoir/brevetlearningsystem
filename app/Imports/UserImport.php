<?php

namespace App\Imports;

use App\Models\Course;
use App\Models\CourseUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UserImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
{
    use Importable;

    private function formatPhoneNumber($phoneNumber): string
    {
        if ($phoneNumber === null) {
            return '';
        }

        $phone = trim((string) $phoneNumber);
        $phone = preg_replace('/[\s\-\(\)\.]+/', '', $phone);

        if (str_starts_with($phone, '+62')) {
            $phone = '0' . substr($phone, 3);
        } elseif (str_starts_with($phone, '62')) {
            $phone = '0' . substr($phone, 2);
        }

        return $phone;
    }

    private function resolveCourseCode(array $row): ?string
    {
        $courseCode = $row['course_code'] ?? null;

        if ($courseCode === null) {
            return null;
        }

        $courseCode = trim((string) $courseCode);

        return $courseCode !== '' ? $courseCode : null;
    }

    public function model(array $row)
    {
        if (User::where('email', $row['email'])->exists()) {
            return null;
        }

        $phoneNumber = $this->formatPhoneNumber($row['phone_number'] ?? '');

        $user = User::create([
            'name'          => $row['name'],
            'email'         => $row['email'],
            'phone_number'  => $phoneNumber,
            'npwp'          => isset($row['npwp']) ? strval($row['npwp']) : null,
            'address'       => $row['address'],
            'password'      => Hash::make($phoneNumber),
            'role'          => 'pengguna',
            // 'access_rights' => isset($row['access_rights'])
            //     ? json_encode(array_map('trim', explode(',', $row['access_rights'])))
            //     : null,
            'event_id'      => 1,
        ]);

        $courseCode = $this->resolveCourseCode($row);
        if ($courseCode) {
            $course = Course::whereRaw('LOWER(code) = ?', [Str::lower($courseCode)])->first();
            if ($course) {
                CourseUser::firstOrCreate([
                    'course_id' => $course->id,
                    'user_id' => $user->id,
                ]);
            }
        }

        return null;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'regex:/@/',
            ],
            'phone_number' => [
                'required',
                'min:8',
                'regex:/^[0-9+\s\-()]+$/',
                'not_regex:/[a-zA-Z]/',
            ],
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'email.required' => 'Kolom email wajib diisi.',
            'email.email' => 'Kolom email wajib mengandung karakter "@" (format email tidak valid).',
            'email.regex' => 'Kolom email wajib mengandung karakter "@" (format email tidak valid).',
            'phone_number.required' => 'Kolom nomor HP wajib diisi.',
            'phone_number.regex' => 'Kolom nomor HP hanya boleh berisi angka dan tidak boleh mengandung huruf.',
            'phone_number.not_regex' => 'Kolom nomor HP hanya boleh berisi angka dan tidak boleh mengandung huruf.',
            'phone_number.min' => 'Kolom nomor HP minimal 8 digit.',
        ];
    }
}
