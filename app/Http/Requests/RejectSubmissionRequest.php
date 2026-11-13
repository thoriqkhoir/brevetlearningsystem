<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_notes' => ['required', 'string', 'min:3', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'admin_notes.required' => 'Alasan / catatan penolakan wajib diisi.',
            'admin_notes.min' => 'Catatan penolakan minimal 3 karakter.',
            'admin_notes.max' => 'Catatan penolakan maksimal 1000 karakter.',
        ];
    }
}

