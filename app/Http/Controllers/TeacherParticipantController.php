<?php

namespace App\Http\Controllers;

use App\Imports\UserImport;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TeacherParticipantController extends Controller
{
    public function index()
    {
        $participants = User::with('event')
            ->where('role', 'pengguna')
            ->orderByDesc('created_at')
            ->get();

        $events = Event::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Teacher/Participant/Participant', [
            'participants' => $participants,
            'events' => $events,
        ]);
    }

    public function create()
    {
        $events = Event::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Teacher/Participant/FormCreateParticipant', [
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone_number' => 'required|string|min:8|max:255',
            'npwp' => ['required', 'regex:/^\d{16}$/'],
            'address' => 'required|string|max:255',
        ]);

        User::create([
            'event_id' => (int) $validated['event_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'npwp' => $validated['npwp'],
            'address' => $validated['address'],
            'role' => 'pengguna',
            'password' => Hash::make($validated['phone_number']),
        ]);

        return redirect()->route('teacher.participants')->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $participant = User::where('role', 'pengguna')->findOrFail($id);
        $events = Event::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Teacher/Participant/FormEditParticipant', [
            'participant' => $participant,
            'events' => $events,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $participant = User::where('role', 'pengguna')->findOrFail($id);

        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $participant->id,
            'phone_number' => 'required|string|min:8|max:255',
            'npwp' => ['required', 'regex:/^\d{16}$/'],
            'address' => 'required|string|max:255',
        ]);

        $participant->update([
            'event_id' => (int) $validated['event_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'npwp' => $validated['npwp'],
            'address' => $validated['address'],
        ]);

        return redirect()->route('teacher.participants')->with('success', 'Data peserta berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $participant = User::where('role', 'pengguna')->findOrFail($id);
        $participant->delete();

        return redirect()->route('teacher.participants')->with('success', 'Peserta berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls',
        ]);

        try {
            Excel::import(new UserImport(), $request->file('file'));
            return back()->with('success', 'Data peserta berhasil diimport.');
        } catch (\Exception $e) {
            return back()->with('error', 'Import gagal: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $filePath = public_path('templates/format_peserta_tls.xlsx');

        if (!file_exists($filePath)) {
            return back()->with('error', 'File template tidak ditemukan.');
        }

        return response()->download($filePath, 'format_peserta_tls.xlsx');
    }

    public function deleteMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'uuid|exists:users,id',
        ]);

        User::where('role', 'pengguna')
            ->whereIn('id', $validated['ids'])
            ->delete();

        return redirect()->route('teacher.participants')->with('success', 'Peserta terpilih berhasil dihapus.');
    }
}
