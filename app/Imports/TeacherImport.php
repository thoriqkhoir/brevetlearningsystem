<?php

namespace App\Imports;

use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TeacherImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
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

    public function model(array $row)
    {
        if (User::where('email', $row['email'])->exists()) {
            return null;
        }

        $phoneNumber = $this->formatPhoneNumber($row['phone_number'] ?? '');

        return new User([
            'name'          => $row['name'],
            'email'         => $row['email'],
            'phone_number'  => $phoneNumber,
            'institution'   => $row['institution'],
            'max_class'     => strval($row['max_class']),
            'password'      => Hash::make($phoneNumber),
            'role'          => 'pengajar',
            'access_rights' => isset($row['access_rights']) && trim($row['access_rights']) !== ''
                ? json_encode(array_map('trim', explode(',', $row['access_rights'])))
                : json_encode(['efaktur', 'ebupot']),
            'event_id'      => 1,
        ]);
    }

    public function rules(): array
    {
        return [
            'phone_number' => [
                'min:8',
            ],
        ];
    }
}
