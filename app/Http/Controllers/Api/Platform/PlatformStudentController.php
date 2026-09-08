<?php

namespace App\Http\Controllers\Api\Platform;

use App\Http\Controllers\Controller;
use App\Models\CourseTestAttempt;
use App\Models\CourseUser;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformStudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $platform = $request->user();

        $query = User::query()
            ->where('platform_id', $platform->id)
            ->where('role', 'pengguna')
            ->select([
                'id',
                'name',
                'email',
                'phone_number',
                'npwp',
                'address',
                'created_at',
                'last_login_at',
            ]);

        if ($request->filled('course_id')) {
            $courseId = $request->string('course_id')->value();
            $query->whereIn('id', function ($sq) use ($courseId) {
                $sq->select('user_id')
                   ->from('course_users')
                   ->where('course_id', $courseId);
            });
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $students = $query->orderByDesc('created_at')->paginate($perPage);

        $withCourses = $request->boolean('with_courses');

        $data = collect($students->items())->map(function ($student) use ($withCourses) {
            $res = [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone_number' => $student->phone_number,
                'npwp' => $student->npwp,
                'address' => $student->address,
                'created_at' => $student->created_at?->toIso8601String(),
                'last_login_at' => $student->last_login_at?->toIso8601String(),
            ];

            if ($withCourses) {
                $res['courses'] = CourseUser::with(['course:id,name,code,start_date,end_date'])
                    ->where('user_id', $student->id)
                    ->get()
                    ->map(function ($cu) {
                        return [
                            'course_id' => $cu->course_id,
                            'course_name' => $cu->course?->name,
                            'course_code' => $cu->course?->code,
                            'enrolled_at' => $cu->created_at?->toIso8601String(),
                        ];
                    });
            }

            return $res;
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
            ],
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $platform = $request->user();

        $student = User::where('platform_id', $platform->id)
            ->where('role', 'pengguna')
            ->where('id', $id)
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found in this platform.',
            ], 404);
        }

        // Get enrolled courses
        $enrollments = CourseUser::with(['course:id,name,code,description,start_date,end_date', 'courseResults'])
            ->where('user_id', $student->id)
            ->get()
            ->map(function ($enrollment) {
                $avgScore = null;
                if ($enrollment->courseResults && $enrollment->courseResults->count() > 0) {
                    $valid = $enrollment->courseResults->whereNotNull('score')->pluck('score');
                    if ($valid->isNotEmpty()) {
                        $avgScore = round($valid->avg(), 2);
                    }
                }

                return [
                    'enrollment_id' => $enrollment->id,
                    'course_id' => $enrollment->course_id,
                    'course_name' => $enrollment->course?->name,
                    'course_code' => $enrollment->course?->code,
                    'start_date' => $enrollment->course?->start_date,
                    'end_date' => $enrollment->course?->end_date,
                    'average_score' => $avgScore,
                    'enrolled_at' => $enrollment->created_at?->toIso8601String(),
                ];
            });

        // Get course test attempts
        $courseTestAttempts = CourseTestAttempt::with(['courseTest:id,course_id,title,passing_score'])
            ->where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->orderByDesc('submitted_at')
            ->get()
            ->map(function ($attempt) {
                return [
                    'attempt_id' => $attempt->id,
                    'course_test_id' => $attempt->course_test_id,
                    'test_title' => $attempt->courseTest?->title,
                    'score' => $attempt->score,
                    'passed' => $attempt->passed,
                    'started_at' => $attempt->started_at?->toIso8601String(),
                    'submitted_at' => $attempt->submitted_at?->toIso8601String(),
                ];
            });

        // Get standalone test attempts
        $standaloneTestAttempts = TestAttempt::with(['test:id,title,passing_score'])
            ->where('user_id', $student->id)
            ->whereNotNull('submitted_at')
            ->orderByDesc('submitted_at')
            ->get()
            ->map(function ($attempt) {
                return [
                    'attempt_id' => $attempt->id,
                    'test_id' => $attempt->test_id,
                    'test_title' => $attempt->test?->title,
                    'score' => $attempt->score,
                    'passed' => $attempt->passed,
                    'started_at' => $attempt->started_at?->toIso8601String(),
                    'submitted_at' => $attempt->submitted_at?->toIso8601String(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'phone_number' => $student->phone_number,
                    'npwp' => $student->npwp,
                    'address' => $student->address,
                    'created_at' => $student->created_at?->toIso8601String(),
                    'last_login_at' => $student->last_login_at?->toIso8601String(),
                ],
                'courses' => $enrollments,
                'course_test_attempts' => $courseTestAttempts,
                'test_attempts' => $standaloneTestAttempts,
            ],
        ]);
    }
}
