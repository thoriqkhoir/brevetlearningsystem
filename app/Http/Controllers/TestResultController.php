<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\TestUser;
use App\Models\CourseUser;

class TestResultController extends Controller
{
    public function giveFeedback(Request $request, $participantId)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'feedback' => 'nullable|string|max:1000',
        ]);

        // Prioritaskan TestUser
        $testParticipant = TestUser::with('test')->find($participantId);
        if ($testParticipant) {
            $teacherId = optional($testParticipant->test)->teacher_id;
            if ($teacherId !== Auth::id()) {
                return back()->with('error', 'You are not authorized to give feedback to this participant');
            }
            $testParticipant->update(['feedback' => $request->feedback]);
            return back()->with('success', 'Feedback berhasil disimpan');
        }

        // Fallback: dukung CourseUser jika route dipakai oleh halaman kursus
        $courseParticipant = CourseUser::with('course')->find($participantId);
        if ($courseParticipant) {
            if ($courseParticipant->course->teacher_id !== Auth::id()) {
                return back()->with('error', 'You are not authorized to give feedback to this participant');
            }
            $courseParticipant->update(['feedback' => $request->feedback]);
            return back()->with('success', 'Feedback berhasil disimpan');
        }

        return back()->with('error', 'Participant tidak ditemukan');
    }

    public function deleteFeedback(Request $request, $participantId)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        // Prioritaskan TestUser
        $testParticipant = TestUser::with('test')->find($participantId);
        if ($testParticipant) {
            $teacherId = optional($testParticipant->test)->teacher_id;
            if ($teacherId !== Auth::id()) {
                return back()->with('error', 'Unauthorized');
            }
            $testParticipant->update(['feedback' => null]);
            return back()->with('success', 'Feedback berhasil dihapus!');
        }

        // Fallback: CourseUser
        $courseParticipant = CourseUser::with('course')->find($participantId);
        if ($courseParticipant) {
            if ($courseParticipant->course->teacher_id !== Auth::id()) {
                return back()->with('error', 'Unauthorized');
            }
            $courseParticipant->update(['feedback' => null]);
            return back()->with('success', 'Feedback berhasil dihapus!');
        }

        return back()->with('error', 'Participant tidak ditemukan');
    }
}
