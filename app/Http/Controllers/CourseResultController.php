<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseResultController extends Controller
{
    public function updateScore(Request $request, $id)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'score' => 'required|numeric|min:0|max:100',
        ]);

        $courseResult = CourseResult::findOrFail($id);

        $course = $courseResult->courseUser->course;
        if ($course->teacher_id !== Auth::id()) {
            return back()->with('error', 'You are not authorized to grade this assignment');
        }

        $courseResult->update([
            'score' => $request->score,
        ]);

        return back()->with('success', 'Penilaian berhasil disimpan');
    }

    public function deleteScore($id)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        $courseResult = CourseResult::findOrFail($id);

        $course = $courseResult->courseUser->course;
        if ($course->teacher_id !== Auth::id()) {
            return back()->with('error', 'You are not authorized to delete this score');
        }

        $courseResult->update([
            'score' => null,
        ]);

        return back()->with('success', 'Nilai berhasil dihapus!');
    }

    public function deleteAverageScore($participantId)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        $participant = CourseUser::with('course')->findOrFail($participantId);

        if ($participant->course->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $participant->courseResults()->update([
            'score' => null,
        ]);

        return back()->with('success', 'Semua nilai peserta berhasil dihapus!');
    }

    public function giveFeedback(Request $request, $participantId)
    {
        if (Auth::user()->role !== 'pengajar') {
            return back()->with('error', 'Unauthorized');
        }

        $request->validate([
            'feedback' => 'nullable|string|max:1000',
        ]);

        $participant = CourseUser::findOrFail($participantId);

        if ($participant->course->teacher_id !== Auth::id()) {
            return back()->with('error', 'You are not authorized to give feedback to this participant');
        }

        $participant->update([
            'feedback' => $request->feedback,
        ]);

        return back()->with('success', 'Feedback berhasil disimpan');
    }

    public function deleteFeedback(Request $request, $participantId)
    {
        $participant = CourseUser::with('course')->findOrFail($participantId);

        if ($participant->course->teacher_id !== Auth::id()) {
            return back()->with('error', 'Unauthorized');
        }

        $participant->update([
            'feedback' => null,
        ]);

        return back()->with('success', 'Feedback berhasil dihapus!');
    }
}
