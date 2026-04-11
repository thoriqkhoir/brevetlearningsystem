<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Spt;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UserImport;
use App\Models\Bupot;
use App\Models\Event;

class AdminController extends Controller
{
    public function index()
    {
        $userCount = User::where('role', 'pengguna')->count();
        $eventCount = Event::count();
        $userLoginToday = User::where('role', 'pengguna')
            ->where('last_login_at', '>=', now()->startOfDay())
            ->count();
        $outputInvoiceCount = Invoice::where('type', 'keluaran')->count();
        $inputInvoiceCount = Invoice::where('type', 'masukan')->count();
        $bupotCount = Bupot::count();
        $sptPpnCount = Spt::where('form_id', 1)->count();
        $sptUnifikasiCount = Spt::where('form_id', 2)->count();
        $sptPph21Count = Spt::where('form_id', 3)->count();

        return Inertia::render('Admin/Dashboard', [

            'userCount' => $userCount,
            'eventCount' => $eventCount,
            'userLoginToday' => $userLoginToday,
            'outputInvoiceCount' => $outputInvoiceCount,
            'inputInvoiceCount' => $inputInvoiceCount,
            'bupotCount' => $bupotCount,
            'sptPpnCount' => $sptPpnCount,
            'sptUnifikasiCount' => $sptUnifikasiCount,
            'sptPph21Count' => $sptPph21Count,
        ]);
    }

    public function users()
    {
        $users = User::with('event')
            ->where('role', 'pengguna')
            ->orderBy('created_at', 'desc')
            ->get();

        $events = Event::select('id', 'name')->get();

        return Inertia::render('Admin/DaftarPengguna', [
            'users' => $users,
            'events' => $events,
        ]);
    }

    public function create()
    {
        $events = Event::all();
        return Inertia::render('Admin/FormCreateUser', [
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid',
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone_number' => 'required|string|min:8|max:255',
            'role' => 'required|in:admin,pengguna',
            'email_verified_at' => 'nullable|date',
            'password' => 'required|string|min:8',
            'npwp' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'last_login_at' => 'nullable|date',
            'last_logout_at' => 'nullable|date',
            // 'access_rights' => 'nullable|array',
            // 'access_rights.*' => 'in:efaktur,ebupot',
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
            $user->npwp = $validated['npwp'];
            $user->address = $validated['address'];
            $user->last_login_at = $validated['last_login_at'];
            $user->last_logout_at = $validated['last_logout_at'];
            // $user->access_rights = $validated['access_rights']
            //     ? json_encode($validated['access_rights'])
            //     : null;
            $user->save();

            return redirect()->route('admin.users')->with('success', 'Pengguna berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users')->with('success', 'Pengguna gagal ditambahkan.');
        }
    }

    public function show($id)
    {
        $user = User::with('event')->findOrFail($id);

        $user->is_password_reset = Hash::check($user->phone_number, $user->password);

        $fakturKeluaranCount = Invoice::where('user_id', $id)->where('type', 'keluaran')->count();
        $fakturMasukanCount = Invoice::where('user_id', $id)->where('type', 'masukan')->count();

        $bupotCount = Bupot::where('user_id', $id)->count();

        $sptCount = Spt::where('user_id', $id)->count();

        $fakturs = Invoice::where('user_id', $id)->get();
        $bupots = Bupot::with('object')->where('user_id', $id)->get();
        $spts = Spt::where('user_id', $id)->get();

        return Inertia::render('Admin/DetailPengguna', [
            'user' => $user,
            'fakturKeluaranCount' => $fakturKeluaranCount,
            'fakturMasukanCount' => $fakturMasukanCount,
            'bupotCount' => $bupotCount,
            'sptCount' => $sptCount,
            'fakturs' => $fakturs,
            'bupots' => $bupots,
            'spts' => $spts,
        ]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        $events = Event::all();

        return Inertia::render('Admin/FormEditUser', [
            'user' => $user,
            'events' => $events,
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
            'npwp' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            // 'access_rights' => 'nullable|array',
            // 'access_rights.*' => 'in:efaktur,ebupot',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->event_id = $validated['event_id'];
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone_number'];
            $user->email_verified_at = $validated['email_verified_at'];
            $user->npwp = $validated['npwp'];
            $user->address = $validated['address'];
            // $user->access_rights = $validated['access_rights']
            //     ? json_encode($validated['access_rights'])
            //     : null;
            $user->save();

            return redirect()->route('admin.users')->with('success', 'Pengguna berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users')->with('success', 'Pengguna gagal diperbarui.');
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Pengguna berhasil dihapus.');
    }

    public function downloadTemplate()
    {
        $filePath = public_path('templates/format_peserta_tls.xlsx');

        if (!file_exists($filePath)) {
            return redirect()->back()->with('error', 'File template tidak ditemukan.');
        }

        return response()->download($filePath, 'format_peserta_tls.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new UserImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data user berhasil diimport!');
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
            return redirect()->route('admin.users')->with('success', 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users')->with('error', 'Gagal menghapus pengguna.');
        }
    }

    public function resetPassword($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->password = Hash::make($user->phone_number);
            $user->save();

            return redirect()->route('admin.show', $user->id)->with('success', 'Kata sandi berhasil direset ke nomor telepon.');
        } catch (\Exception $e) {
            return redirect()->route('admin.show', $user->id)->with('error', 'Gagal mereset kata sandi.');
        }
    }

    public function resetPasswordMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:users,id',
        ]);

        try {
            $users = User::whereIn('id', $request->ids)->get();

            foreach ($users as $user) {
                $user->password = Hash::make($user->phone_number);
                $user->save();
            }

            return redirect()->route('admin.users')->with('success', 'Kata sandi berhasil direset untuk ' . count($users) . ' pengguna.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users')->with('error', 'Gagal mereset kata sandi.');
        }
    }
}
