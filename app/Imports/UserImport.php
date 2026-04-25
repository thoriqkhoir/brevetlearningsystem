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

        $user = User::create([
            'name'          => $row['name'],
            'email'         => $row['email'],
            'phone_number'  => strval($row['phone_number']),
            'npwp'          => isset($row['npwp']) ? strval($row['npwp']) : null,
            'address'       => $row['address'],
            'password'      => Hash::make(strval($row['phone_number']),),
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
            'phone_number' => [
                'min:8',
            ],
            // 'access_rights' => [
            //     'nullable',
            //     function ($attribute, $value, $fail) {
            //         $rights = array_map('trim', explode(',', $value));
            //         $validRights = ['efaktur', 'ebupot'];
            //         foreach ($rights as $right) {
            //             if (!in_array($right, $validRights)) {
            //                 $fail("The $attribute contains invalid value: $right.");
            //             }
            //         }
            //     },
            // ],
        ];
    }
}
