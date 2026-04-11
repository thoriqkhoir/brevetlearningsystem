<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Ledger;
use Illuminate\Auth\MustVerifyEmail;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if ($activeCourseId) {
            $ledgers = Ledger::where('user_id', $user->id)
                ->forCourse($activeCourseId)
                ->get();
        } else {
            $ledgers = collect();
        }
        
        return Inertia::render('Dashboard', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'ledgers' => $ledgers,
            'active_course_id' => $activeCourseId,
            'no_active_course' => !$activeCourseId,
        ]);
    }
}