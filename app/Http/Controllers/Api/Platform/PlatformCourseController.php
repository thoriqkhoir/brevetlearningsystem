<?php

namespace App\Http\Controllers\Api\Platform;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseTest;
use App\Models\CourseUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformCourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $platform = $request->user();

        $query = Course::query()
            ->whereHas('participants.user', function ($q) use ($platform) {
                $q->where('platform_id', $platform->id)
                  ->where('role', 'pengguna');
            })
            ->with(['user:id,name,email'])
            ->withCount([
                'participants as students_count' => function ($q) use ($platform) {
                    $q->whereHas('user', function ($uq) use ($platform) {
                        $uq->where('platform_id', $platform->id)
                           ->where('role', 'pengguna');
                    });
                },
                'courseTests as total_tests_count',
            ]);

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $courses = $query->orderByDesc('created_at')->paginate($perPage);

        $results = collect($courses->items())->map(function ($course) {
            return [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
                'description' => $course->description,
                'start_date' => $course->start_date,
                'end_date' => $course->end_date,
                'teacher' => $course->user ? [
                    'id' => $course->user->id,
                    'name' => $course->user->name,
                    'email' => $course->user->email,
                ] : null,
                'students_count' => (int) $course->students_count,
                'total_tests_count' => (int) $course->total_tests_count,
                'created_at' => $course->created_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $results,
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
            ],
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $platform = $request->user();

        $course = Course::with([
            'user:id,name,email',
            'courseTests:id,course_id,title,passing_score,created_at',
        ])
        ->withCount([
            'participants as students_count' => function ($q) use ($platform) {
                $q->whereHas('user', function ($uq) use ($platform) {
                    $uq->where('platform_id', $platform->id)
                       ->where('role', 'pengguna');
                });
            },
        ])
        ->where('id', $id)
        ->whereHas('participants.user', function ($q) use ($platform) {
            $q->where('platform_id', $platform->id)
              ->where('role', 'pengguna');
        })
        ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found or has no students from this platform.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
                'description' => $course->description,
                'start_date' => $course->start_date,
                'end_date' => $course->end_date,
                'teacher' => $course->user ? [
                    'id' => $course->user->id,
                    'name' => $course->user->name,
                    'email' => $course->user->email,
                ] : null,
                'students_count' => (int) $course->students_count,
                'tests' => $course->courseTests->map(function ($test) {
                    return [
                        'id' => $test->id,
                        'title' => $test->title,
                        'passing_score' => $test->passing_score,
                        'created_at' => $test->created_at?->toIso8601String(),
                    ];
                }),
                'created_at' => $course->created_at?->toIso8601String(),
            ],
        ]);
    }

    public function students(Request $request, string $id): JsonResponse
    {
        $platform = $request->user();

        $course = Course::with(['user:id,name,email'])
            ->where('id', $id)
            ->whereHas('participants.user', function ($q) use ($platform) {
                $q->where('platform_id', $platform->id)
                  ->where('role', 'pengguna');
            })
            ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found or has no students from this platform.',
            ], 404);
        }

        $query = CourseUser::query()
            ->where('course_id', $id)
            ->whereHas('user', function ($q) use ($platform) {
                $q->where('platform_id', $platform->id)
                  ->where('role', 'pengguna');
            })
            ->with([
                'user:id,name,email,phone_number,npwp,address,last_login_at',
                'courseResults',
            ]);

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $enrollments = $query->orderByDesc('created_at')->paginate($perPage);

        $results = collect($enrollments->items())->map(function ($enrollment) {
            $avgScore = null;
            if ($enrollment->courseResults && $enrollment->courseResults->count() > 0) {
                $valid = $enrollment->courseResults->whereNotNull('score')->pluck('score');
                if ($valid->isNotEmpty()) {
                    $avgScore = round($valid->avg(), 2);
                }
            }

            return [
                'enrollment_id' => $enrollment->id,
                'enrolled_at' => $enrollment->created_at?->toIso8601String(),
                'feedback' => $enrollment->feedback,
                'average_score' => $avgScore,
                'student' => $enrollment->user ? [
                    'id' => $enrollment->user->id,
                    'name' => $enrollment->user->name,
                    'email' => $enrollment->user->email,
                    'phone_number' => $enrollment->user->phone_number,
                    'npwp' => $enrollment->user->npwp,
                    'address' => $enrollment->user->address,
                    'last_login_at' => $enrollment->user->last_login_at?->toIso8601String(),
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
            ],
            'data' => $results,
            'meta' => [
                'current_page' => $enrollments->currentPage(),
                'last_page' => $enrollments->lastPage(),
                'per_page' => $enrollments->perPage(),
                'total' => $enrollments->total(),
            ],
        ]);
    }

    public function tests(Request $request, string $id): JsonResponse
    {
        $platform = $request->user();

        $course = Course::with(['user:id,name,email'])
            ->where('id', $id)
            ->whereHas('participants.user', function ($q) use ($platform) {
                $q->where('platform_id', $platform->id)
                  ->where('role', 'pengguna');
            })
            ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found or has no students from this platform.',
            ], 404);
        }

        $query = CourseTest::query()
            ->where('course_id', $id);

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->where('title', 'like', "%{$search}%");
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $tests = $query->orderBy('created_at', 'asc')->paginate($perPage);

        $results = collect($tests->items())->map(function ($test) {
            return [
                'id' => $test->id,
                'title' => $test->title,
                'description' => $test->description,
                'duration' => $test->duration,
                'passing_score' => $test->passing_score,
                'questions_to_show' => $test->questions_to_show,
                'question_count' => $test->question_count,
                'max_attempts' => $test->max_attempts,
                'start_date' => $test->start_date?->toIso8601String(),
                'end_date' => $test->end_date?->toIso8601String(),
                'show_score' => $test->show_score,
                'show_correct_answers' => $test->show_correct_answers,
                'remedial_enabled' => $test->remedial_enabled,
                'remedial_end_date' => $test->remedial_end_date?->toIso8601String(),
                'created_at' => $test->created_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
            ],
            'data' => $results,
            'meta' => [
                'current_page' => $tests->currentPage(),
                'last_page' => $tests->lastPage(),
                'per_page' => $tests->perPage(),
                'total' => $tests->total(),
            ],
        ]);
    }
}
