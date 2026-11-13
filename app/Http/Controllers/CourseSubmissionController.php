<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSubmission;
use App\Models\CourseUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseSubmissionController extends Controller
{
    /**
     * Store a newly created course submission (task) by teacher.
     */
    public function store(Request $request, Course $course)
    {
        $this->authorizeTeacher($course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip,rar,png,jpg,jpeg,xlsx,xls,csv,txt',
        ]);

        $filePath = null;
        $originalFilename = null;
        $fileSize = null;
        $mimeType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalFilename = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType() ?: 'application/octet-stream';
            $safeName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs("course-submissions/{$course->id}", $safeName, 'local');
        }

        CourseSubmission::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
            'file_path' => $filePath,
            'original_filename' => $originalFilename,
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
        ]);

        return back()->with('success', 'Tugas submission berhasil dibuat.');
    }

    /**
     * Update an existing course submission (task).
     */
    public function update(Request $request, Course $course, CourseSubmission $courseSubmission)
    {
        $this->authorizeTeacher($course);

        if ($courseSubmission->course_id !== $course->id) {
            abort(404, 'Submission tidak ditemukan di kelas ini.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip,rar,png,jpg,jpeg,xlsx,xls,csv,txt',
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
        ];

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($courseSubmission->file_path && Storage::disk('local')->exists($courseSubmission->file_path)) {
                Storage::disk('local')->delete($courseSubmission->file_path);
            }

            $file = $request->file('file');
            $data['original_filename'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['mime_type'] = $file->getMimeType() ?: 'application/octet-stream';
            $safeName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $data['file_path'] = $file->storeAs("course-submissions/{$course->id}", $safeName, 'local');
        }

        $courseSubmission->update($data);

        return back()->with('success', 'Tugas submission berhasil diperbarui.');
    }

    /**
     * Delete a course submission (task).
     */
    public function destroy(Course $course, CourseSubmission $courseSubmission)
    {
        $this->authorizeTeacher($course);

        if ($courseSubmission->course_id !== $course->id) {
            abort(404, 'Submission tidak ditemukan di kelas ini.');
        }

        if ($courseSubmission->file_path && Storage::disk('local')->exists($courseSubmission->file_path)) {
            Storage::disk('local')->delete($courseSubmission->file_path);
        }

        $courseSubmission->delete();

        return back()->with('success', 'Tugas submission berhasil dihapus.');
    }

    /**
     * Download template/attachment from teacher.
     */
    public function downloadAttachment(Course $course, CourseSubmission $courseSubmission)
    {
        $user = Auth::user();

        // Must be teacher, admin, or enrolled student
        $isTeacher = $user->role === 'pengajar' && $course->teacher_id === $user->id;
        $isAdmin = $user->role === 'admin';
        $isEnrolled = CourseUser::where('course_id', $course->id)->where('user_id', $user->id)->exists();

        if (!$isTeacher && !$isAdmin && !$isEnrolled) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengunduh lampiran ini.');
        }

        if ($courseSubmission->course_id !== $course->id || !$courseSubmission->file_path || !Storage::disk('local')->exists($courseSubmission->file_path)) {
            abort(404, 'Berkas lampiran tidak ditemukan.');
        }

        return Storage::disk('local')->download($courseSubmission->file_path, $courseSubmission->original_filename ?: 'attachment');
    }

    private function authorizeTeacher(Course $course): void
    {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role !== 'pengajar' || $course->teacher_id !== $user->id) {
            abort(403, 'Anda tidak memiliki izin untuk mengelola submission kelas ini.');
        }
    }
}

