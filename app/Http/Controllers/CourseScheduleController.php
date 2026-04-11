<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
