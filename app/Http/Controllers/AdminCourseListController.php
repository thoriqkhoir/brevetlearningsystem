<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCourseListController extends Controller
{
    public function index(Request $request)
    {
        $now = now();

        $coursesQuery = Course::query()
            ->with(['user:id,name,email'])
            ->withCount('participants')
            ->select([
                'id',
                'teacher_id',
                'name',
                'code',
                'description',
                'access_rights',
                'start_date',
                'end_date',
                'created_at',
            ]);

        if ($request->filled('teacher_id')) {
            $coursesQuery->where('teacher_id', $request->string('teacher_id')->value());
        }

        if ($request->filled('status')) {
            $status = $request->string('status')->value();

            if ($status === 'active') {
                $coursesQuery
                    ->whereNotNull('start_date')
                    ->whereNotNull('end_date')
                    ->where('start_date', '<=', $now)
                    ->where('end_date', '>=', $now);
            }

            if ($status === 'upcoming') {
                $coursesQuery
                    ->whereNotNull('start_date')
                    ->where('start_date', '>', $now);
            }

            if ($status === 'finished') {
                $coursesQuery
                    ->whereNotNull('end_date')
                    ->where('end_date', '<', $now);
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();

            $coursesQuery->where(function ($query) use ($search) {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date_from')) {
            $coursesQuery->whereDate('start_date', '>=', $request->string('start_date_from')->value());
        }

        if ($request->filled('start_date_to')) {
            $coursesQuery->whereDate('start_date', '<=', $request->string('start_date_to')->value());
        }

        if ($request->filled('end_date_from')) {
            $coursesQuery->whereDate('end_date', '>=', $request->string('end_date_from')->value());
        }

        if ($request->filled('end_date_to')) {
            $coursesQuery->whereDate('end_date', '<=', $request->string('end_date_to')->value());
        }

        $courses = $coursesQuery
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $teachers = User::query()
            ->where('role', 'pengajar')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/DaftarKelas', [
            'courses' => $courses,
            'teachers' => $teachers,
            'filters' => $request->only([
                'teacher_id',
                'status',
                'search',
                'start_date_from',
                'start_date_to',
                'end_date_from',
                'end_date_to',
            ]),
        ]);
    }
}
