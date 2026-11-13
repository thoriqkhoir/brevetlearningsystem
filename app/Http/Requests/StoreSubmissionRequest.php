<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx,ppt,pptx,zip,png,jpg,jpeg',
                'max:20480', // 20 MB
            ],
            'student_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File submission wajib diunggah.',
            'file.file' => 'Berkas yang diunggah harus berupa file.',
            'file.mimes' => 'Format file yang diperbolehkan: PDF, DOC, DOCX, PPT, PPTX, ZIP, PNG, JPG, JPEG.',
            'file.max' => 'Ukuran file maksimal adalah 20MB.',
            'student_notes.max' => 'Catatan siswa maksimal 1000 karakter.',
        ];
    }
}

