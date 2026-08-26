<?php

namespace Tests\Unit;

use App\Imports\UserImport;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class UserImportValidationTest extends TestCase
{
    public function test_valid_data_passes_validation()
    {
        $import = new UserImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        $validator = Validator::make([
            'email' => 'peserta@example.com',
            'phone_number' => '081234567890',
        ], $rules, $messages);

        $this->assertFalse($validator->fails());
    }

    public function test_email_without_at_symbol_fails_with_custom_message()
    {
        $import = new UserImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        $validator = Validator::make([
            'email' => 'pesertaexample.com',
            'phone_number' => '081234567890',
        ], $rules, $messages);

        $this->assertTrue($validator->fails());
        $errors = $validator->errors()->get('email');
        $this->assertNotEmpty($errors);
        $this->assertContains('Kolom email wajib mengandung karakter "@" (format email tidak valid).', $errors);
    }

    public function test_phone_number_with_letters_fails_with_custom_message()
    {
        $import = new UserImport();
        $rules = $import->rules();
        $messages = $import->customValidationMessages();

        $validator = Validator::make([
            'email' => 'peserta@example.com',
            'phone_number' => '0812abc345',
        ], $rules, $messages);

        $this->assertTrue($validator->fails());
        $errors = $validator->errors()->get('phone_number');
        $this->assertNotEmpty($errors);
        $this->assertContains('Kolom nomor HP hanya boleh berisi angka dan tidak boleh mengandung huruf.', $errors);
    }
}
