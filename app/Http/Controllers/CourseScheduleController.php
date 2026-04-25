<?php

namespace App\Http\Controllers;

use App\Imports\CourseScheduleImport;
use App\Models\Course;
use App\Models\CourseSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class CourseScheduleController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $this->authorizeCourse($course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'scheduled_at' => 'required|date',
            'zoom_link' => 'nullable|url|max:2048',
        ]);

        $validated['zoom_link'] = $validated['zoom_link'] ?? null;

        $course->courseSchedules()->create($validated);

        return back()->with('success', 'Jadwal kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Course $course, CourseSchedule $schedule)
    {
        $this->authorizeCourse($course);
        $this->ensureScheduleBelongsToCourse($course, $schedule);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'scheduled_at' => 'required|date',
            'zoom_link' => 'nullable|url|max:2048',
        ]);

        $validated['zoom_link'] = $validated['zoom_link'] ?? null;

        $schedule->update($validated);

        return back()->with('success', 'Jadwal kelas berhasil diperbarui.');
    }

    public function destroy(Course $course, CourseSchedule $schedule)
    {
        $this->authorizeCourse($course);
        $this->ensureScheduleBelongsToCourse($course, $schedule);

        $schedule->delete();

        return back()->with('success', 'Jadwal kelas berhasil dihapus.');
    }

    public function import(Request $request, Course $course)
    {
        $this->authorizeCourse($course);

        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
        ], [
            'file.required' => 'File Excel harus dipilih.',
            'file.mimes' => 'File harus berformat Excel (.xlsx, .xls, .csv).',
        ]);

        try {
            Excel::import(new CourseScheduleImport($course), $request->file('file'));

            return back()->with('success', 'Jadwal kelas berhasil diimport.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $errorMessages = [];

            foreach ($e->failures() as $failure) {
                $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
            }

            return back()->with('error', 'Import gagal! ' . implode(' | ', array_slice($errorMessages, 0, 5)));
        } catch (\Exception $e) {
            return back()->with('error', 'Import gagal! ' . $e->getMessage());
        }
    }

    private function authorizeCourse(Course $course): void
    {
        if ($course->teacher_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
    }

    private function ensureScheduleBelongsToCourse(Course $course, CourseSchedule $schedule): void
    {
        if ($schedule->course_id !== $course->id) {
            abort(404);
        }
    }
}
