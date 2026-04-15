<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTestListController extends Controller
{
    public function index(Request $request)
    {
        $now = now();

        $testsQuery = Test::query()
            ->with(['user:id,name,email'])
            ->withCount('participants')
            ->select([
                'id',
                'teacher_id',
                'title',
                'code',
                'description',
                'duration',
                'passing_score',
                'start_date',
                'end_date',
                'created_at',
            ]);

        if ($request->filled('teacher_id')) {
            $testsQuery->where('teacher_id', $request->string('teacher_id')->value());
        }

        if ($request->filled('status')) {
            $status = $request->string('status')->value();

            if ($status === 'ongoing') {
                $testsQuery
                    ->whereNotNull('start_date')
                    ->whereNotNull('end_date')
                    ->where('start_date', '<=', $now)
                    ->where('end_date', '>=', $now);
            }

            if ($status === 'upcoming') {
                $testsQuery
                    ->whereNotNull('start_date')
                    ->where('start_date', '>', $now);
            }

            if ($status === 'finished') {
                $testsQuery
                    ->whereNotNull('end_date')
                    ->where('end_date', '<', $now);
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();

            $testsQuery->where(function ($query) use ($search) {
                $query
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date_from')) {
            $testsQuery->whereDate('start_date', '>=', $request->string('start_date_from')->value());
        }

        if ($request->filled('start_date_to')) {
            $testsQuery->whereDate('start_date', '<=', $request->string('start_date_to')->value());
        }

        if ($request->filled('end_date_from')) {
            $testsQuery->whereDate('end_date', '>=', $request->string('end_date_from')->value());
        }

        if ($request->filled('end_date_to')) {
            $testsQuery->whereDate('end_date', '<=', $request->string('end_date_to')->value());
        }

        $tests = $testsQuery
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $teachers = User::query()
            ->where('role', 'pengajar')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/DaftarUjian', [
            'tests' => $tests,
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
