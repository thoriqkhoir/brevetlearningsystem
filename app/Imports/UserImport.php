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

class UserImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithValidation
{
    use Importable;

    public function model(array $row)
    {
        if (User::where('email', $row['email'])->exists()) {
            return null;
        }

        return new User([
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
