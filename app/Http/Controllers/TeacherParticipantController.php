<?php

namespace App\Http\Controllers;

use App\Imports\UserImport;
use App\Models\Course;
use App\Models\CourseUser;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;

class TeacherParticipantController extends Controller
{
    public function index(Request $request)
    {
        $teacherId = Auth::id();

        // Get courses owned by teacher
        $courseIds = Course::where('teacher_id', $teacherId)->pluck('id');
        $participantUserIds = CourseUser::whereIn('course_id', $courseIds)->pluck('user_id')->unique();

        $query = User::query()
            ->with(['platform', 'event'])
            ->where('role', 'pengguna');

        // Optional filter to show only participants in teacher's courses, or all platform participants
        if ($request->boolean('only_my_courses', false)) {
            $query->whereIn('id', $participantUserIds);
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('platform_id')) {
            $query->where('platform_id', $request->string('platform_id')->value());
        }

        $participants = $query->orderByDesc('created_at')->get();
        $platforms = Platform::active()->orderBy('name')->get(['id', 'name', 'code']);
        $events = \App\Models\Event::select('id', 'name')->get();

        return Inertia::render('Teacher/Participant/Participant', [
            'participants' => $participants,
            'events' => $events,
            'platforms' => $platforms,
            'filters' => $request->only(['search', 'platform_id', 'only_my_courses']),
        ]);
    }

    public function create()
    {
        $platforms = Platform::active()->orderBy('name')->get(['id', 'name', 'code']);
        $events = \App\Models\Event::select('id', 'name')->get();

        return Inertia::render('Teacher/Participant/FormCreateParticipant', [
            'platforms' => $platforms,
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone_number' => 'required|string|min:8|max:255',
            'password' => 'nullable|string|min:8',
            'platform_id' => 'nullable|uuid|exists:platforms,id',
            'npwp' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $phoneNumber = $validated['phone_number'];
        $user = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $validated['platform_id'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $phoneNumber,
            'role' => 'pengguna',
            'password' => Hash::make($validated['password'] ?? $phoneNumber),
            'npwp' => $validated['npwp'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return redirect()->route('teacher.participants')->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $user = User::where('role', 'pengguna')->findOrFail($id);
        $platforms = Platform::active()->orderBy('name')->get(['id', 'name', 'code']);
        $events = \App\Models\Event::select('id', 'name')->get();

        return Inertia::render('Teacher/Participant/FormEditParticipant', [
            'participant' => $user,
            'platforms' => $platforms,
            'events' => $events,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('role', 'pengguna')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone_number' => 'required|string|max:255',
            'platform_id' => 'nullable|uuid|exists:platforms,id',
            'npwp' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'platform_id' => $validated['platform_id'] ?? null,
            'npwp' => $validated['npwp'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return redirect()->route('teacher.participants')->with('success', 'Data peserta berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = User::where('role', 'pengguna')->findOrFail($id);
        $user->delete();

        return redirect()->route('teacher.participants')->with('success', 'Peserta berhasil dihapus.');
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:users,id',
        ]);

        User::where('role', 'pengguna')->whereIn('id', $request->ids)->delete();

        return redirect()->route('teacher.participants')->with('success', 'Peserta terpilih berhasil dihapus.');
    }

    public function downloadTemplate()
    {
        $filePath = public_path('templates/format_peserta_bls.xlsx');

        if (!file_exists($filePath)) {
            return redirect()->back()->with('error', 'File template tidak ditemukan.');
        }

        return response()->download($filePath, 'format_peserta_bls.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
            'platform_id' => 'nullable|uuid|exists:platforms,id',
        ]);

        try {
            DB::transaction(function () use ($request) {
                Excel::import(new UserImport($request->input('platform_id')), $request->file('file'));
            });

            return redirect()->back()->with('success', 'Data peserta berhasil diimport!');
        } catch (ValidationException $e) {
            $failures = $e->failures();
            $messages = [];
            foreach ($failures as $failure) {
                $row = $failure->row();
                foreach ($failure->errors() as $error) {
                    $messages[] = "Baris {$row}: {$error}";
                }
            }
            $uniqueMessages = array_values(array_unique($messages));
            $displayMessages = array_slice($uniqueMessages, 0, 5);
            $errorMessage = implode(' | ', $displayMessages);
            if (count($uniqueMessages) > 5) {
                $errorMessage .= ' (dan ' . (count($uniqueMessages) - 5) . ' kesalahan lainnya)';
            }

            return redirect()->back()->with('error', 'Import gagal. ' . $errorMessage);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal! ' . $e->getMessage());
        }
    }
}
