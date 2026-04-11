<?php

namespace App\Http\Controllers;

use App\Imports\TeacherImport;
use App\Imports\UserImport;
use App\Models\Bupot;
use App\Models\Course;
use App\Models\CourseUser;
use App\Models\Event;
use App\Models\Invoice;
use App\Models\Spt;
use App\Models\User;
use App\Models\Test;
use App\Models\TestUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TeacherController extends Controller
{
    public function index()
    {
        $id = Auth::id();
        $courses = Course::where('teacher_id', $id)->orderBy('created_at', 'desc')->get();

        $courseIds = $courses->pluck('id')->toArray();

        $endDate = now()->endOfDay();
        $startDate = now()->subDays(90)->startOfDay();

        $courseRegistrations = CourseUser::whereIn('course_id', $courseIds)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $testIds = Test::where('teacher_id', $id)->pluck('id');
        $testRegistrations = TestUser::whereIn('test_id', $testIds)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $dailyStats = [];
        $currentDate = clone $startDate;

        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');

            $courseCount = $courseRegistrations->get($dateStr)->count ?? 0;
            $testCount = $testRegistrations->get($dateStr)->count ?? 0;

            $stats = [
                'date' => $dateStr,
                'courseRegistrations' => $courseCount,
                'testRegistrations' => $testCount,
            ];

            $dailyStats[] = $stats;

            $currentDate->addDay();
        }

        return Inertia::render('Teacher/Dashboard', [
            'courses' => $courses,
            'courseStats' => $dailyStats,
        ]);
    }

    public function teacher()
    {
        $users = User::with('event')
            ->where('role', 'pengajar')
            ->orderBy('created_at', 'desc')
            ->get();
        $events = Event::select('id', 'name')->get();

        return Inertia::render('Admin/Teacher/Teacher', [
            'users' => $users,
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teacher/FormCreateTeacher');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid',
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone_number' => 'required|string|min:8|max:255',
            'role' => 'required|in:admin,pengguna,pengajar',
            'email_verified_at' => 'nullable|date',
            'password' => 'required|string|min:8',
            'institution' => 'nullable|string|max:255',
            'max_class' => 'nullable|integer|min:1',
            'max_test' => 'nullable|integer|min:1',
            'last_login_at' => 'nullable|date',
            'last_logout_at' => 'nullable|date',
            'access_rights' => 'nullable|array',
            'access_rights.*' => 'in:efaktur,ebupot',
        ]);

        try {
            $user = new User();
            $user->id = $validated['id'];
            $user->event_id = $validated['event_id'];
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone_number'];
            $user->role = $validated['role'];
            $user->email_verified_at = $validated['email_verified_at'];
            $user->password = Hash::make($validated['password']);
            $user->institution = $validated['institution'];
            $user->max_class = $validated['max_class'] ?? 0;
            $user->max_test = $validated['max_test'] ?? 0;
            $user->last_login_at = $validated['last_login_at'];
            $user->last_logout_at = $validated['last_logout_at'];
            $user->access_rights = $validated['access_rights']
                ? json_encode($validated['access_rights'])
                : null;
            $user->save();

            return redirect()->route('admin.teachers')->with('success', 'Pengajar berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->route('admin.teachers')->with('error', 'Pengajar gagal ditambahkan.');
        }
    }

    public function show($id)
    {
        $user = User::with('event')->findOrFail($id);

        $courses = Course::where('teacher_id', $id)->orderBy('created_at', 'desc')->get();
        $tests = Test::where('teacher_id', $id)->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Teacher/DetailTeacher', [
            'user' => $user,
            'courses' => $courses,
            'tests' => $tests,
        ]);
    }

    public function showCourse($id, $courseId)
    {
        $course = Course::with('user')->findOrFail($courseId);
        $course->modules_count = $course->modules()->count();

        $participants = $course->participants()->with('user')->get();

        return Inertia::render('Admin/Teacher/DetailCourse', [
            'teacherId' => $id,
            'course' => $course,
            'participants' => $participants,
        ]);
    }

    public function showCourseModules($teacherId, $courseId)
    {
        $teacher = User::findOrFail($teacherId); // Ambil data teacher untuk breadcrumb
        $course = Course::with(['modules' => function ($query) {
            $query->orderBy('created_at');
        }, 'user'])->findOrFail($courseId);

        // Pastikan course belong to teacher
        if ($course->teacher_id !== $teacherId) {
            abort(404, 'Course not found for this teacher');
        }

        $canAccess = false;

        if (Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()) {
            $canAccess = true;
        } elseif (Auth::user()->role === 'pengguna') {
            $participant = CourseUser::where('course_id', $courseId)
                ->where('user_id', Auth::id())
                ->first();
            if ($participant) {
                $canAccess = true;
            }
        } elseif (Auth::user()->role === 'admin') {
            $canAccess = true;
        }

        if (!$canAccess) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses ke kelas ini');
        }

        return Inertia::render('Admin/Teacher/Modules', [
            'teacher' => $teacher,
            'course' => $course,
            'modules' => $course->modules,
            'canManage' => Auth::user()->role === 'pengajar' && $course->teacher_id === Auth::id()
        ]);
    }

    public function showTest($id, $testId)
    {
        $teacher = User::findOrFail($id);
        $test = \App\Models\Test::with('user')->findOrFail($testId);

        // Pastikan test belong to teacher
        if ($test->teacher_id !== $id) {
            abort(404, 'Test not found for this teacher');
        }

        // Load participants if needed
        $participants = $test->participants()->with('user')->get();

        return Inertia::render('Admin/Teacher/DetailTest', [
            'teacher' => $teacher,
            'test' => $test,
            'participants' => $participants,
        ]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/Teacher/FormEditTeacher', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone_number' => 'required|string|max:255',
            'email_verified_at' => 'nullable|date',
            'password' => 'required|string|min:8',
            'institution' => 'nullable|string|max:255',
            'max_class' => 'nullable|integer|min:1',
            'max_test' => 'nullable|integer|min:1',
            'access_rights' => 'nullable|array',
            'access_rights.*' => 'in:efaktur,ebupot',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->event_id = $validated['event_id'];
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone_number'];
            $user->email_verified_at = $validated['email_verified_at'];
            $user->password = Hash::make($validated['password']);
            $user->institution = $validated['institution'];
            $user->max_class = $validated['max_class'] ?? 0;
            $user->max_test = $validated['max_test'] ?? 0;
            $user->access_rights = $validated['access_rights']
                ? json_encode($validated['access_rights'])
                : null;
            $user->save();

            return redirect()->route('admin.teachers')->with('success', 'Pengajar berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('admin.teachers')->with('error', 'Pengajar gagal diperbarui.');
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.teachers')->with('success', 'Pengajar berhasil dihapus.');
    }

    public function downloadTemplate()
    {
        $filePath = public_path('templates/format_pepengajar_tls.xlsx');

        if (!file_exists($filePath)) {
            return redirect()->back()->with('error', 'File template tidak ditemukan.');
        }

        return response()->download($filePath, 'format_pepengajar_tls.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new TeacherImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data pengajar berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal! ' . $e->getMessage());
        }
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:users,id',
        ]);

        try {
            User::whereIn('id', $request->ids)->delete();
            return redirect()->route('admin.teachers')->with('success', 'Pengajar berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.teachers')->with('error', 'Gagal menghapus Pengajar.');
        }
    }
}
