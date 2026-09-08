<?php

namespace App\Http\Controllers\Api\Platform;

use App\Http\Controllers\Controller;
use App\Models\CourseTestAttempt;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformExamResultController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $platform = $request->user();

        $studentIds = User::where('platform_id', $platform->id)
            ->where('role', 'pengguna')
            ->pluck('id');

        $query = CourseTestAttempt::query()
            ->with([
                'user:id,name,email',
                'courseTest:id,course_id,title,passing_score',
                'courseTest.course:id,name,code',
            ])
            ->whereIn('user_id', $studentIds)
            ->whereNotNull('submitted_at');

        if ($request->filled('student_id')) {
            $query->where('user_id', $request->string('student_id')->value());
        }

        if ($request->filled('course_id')) {
            $courseId = $request->string('course_id')->value();
            $query->whereHas('courseTest', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }

        if ($request->filled('passed')) {
            $query->where('passed', $request->boolean('passed'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('submitted_at', '>=', $request->string('date_from')->value());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('submitted_at', '<=', $request->string('date_to')->value());
        }

        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        $attempts = $query->orderByDesc('submitted_at')->paginate($perPage);

        $results = collect($attempts->items())->map(function ($item) {
            return [
                'attempt_id' => $item->id,
                'student' => [
                    'id' => $item->user?->id,
                    'name' => $item->user?->name,
                    'email' => $item->user?->email,
                ],
                'course' => [
                    'id' => $item->courseTest?->course?->id,
                    'name' => $item->courseTest?->course?->name,
                    'code' => $item->courseTest?->course?->code,
                ],
                'test' => [
                    'id' => $item->courseTest?->id,
                    'title' => $item->courseTest?->title,
                    'passing_score' => $item->courseTest?->passing_score,
                ],
                'score' => $item->score,
                'passed' => $item->passed,
                'started_at' => $item->started_at?->toIso8601String(),
                'submitted_at' => $item->submitted_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $results,
            'meta' => [
                'current_page' => $attempts->currentPage(),
                'last_page' => $attempts->lastPage(),
                'per_page' => $attempts->perPage(),
                'total' => $attempts->total(),
            ],
        ]);
    }
}
