<?php

namespace App\Http\Controllers;

use App\Models\Bupot;
use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\MasterObject;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CYController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('CY/NotIssued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft'])
            ->whereHas('object', fn($q) => $q->where('type', 'digunggung'))
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('CY/NotIssued', [
            'bupots' => $bupots,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function issued()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('CY/Issued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereHas('object', fn($q) => $q->where('type', 'digunggung'))
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('CY/Issued', [
            'bupots' => $bupots,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function invalid()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('CY/Invalid', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'canceled')
            ->whereHas('object', fn($q) => $q->where('type', 'digunggung'))
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('CY/Invalid', [
            'bupots' => $bupots,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            abort(403, 'Tidak ada kelas aktif.');
        }

        $bupot = Bupot::with('object')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        return Inertia::render('CY/CY', [
            'user' => $user,
            'bupot' => $bupot,
            'active_course_id' => $activeCourseId,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('CY/FormCreateCY', [
                'user' => $user,
                'objects' => [],
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $objects = MasterObject::where('type', 'digunggung')->get();
        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft', 'approved'])
            ->whereHas('object', fn($q) => $q->where('type', 'digunggung'))
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->get();
        return Inertia::render('CY/FormCreateCY', [
            'user' => $user,
            'objects' => $objects,
            'bupots' => $bupots,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'object_id' => 'required|exists:master_objects,id',
            'bupot_period' => 'required|string|max:255',
            'bupot_year' => 'required|string|max:4',
            'bupot_status' => 'required|in:normal,perbaikan',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'nullable|string|max:255',
            'customer_country' => 'nullable|string|max:255',
            'customer_birth_date' => 'nullable|date',
            'customer_birth_place' => 'nullable|string|max:255',
            'customer_passport' => 'nullable|string|max:255',
            'customer_permit' => 'nullable|string|max:255',
            'customer_ptkp' => 'nullable|string|max:255',
            'customer_position' => 'nullable|string|max:255',
            'facility' => 'required|in:fasilitas lainnya,pph ditanggung pemerintah,tanpa fasilitas',
            'dpp' => 'required|numeric',
            'rates' => 'required|numeric',
            'tax' => 'required|numeric',
            'doc_type' => 'required|string|max:255',
            'doc_no' => 'required|string|max:255',
            'doc_date' => 'required|date',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,draft',
        ]);

        try {
            $bupot = new Bupot($validated);
            $bupot->user_id = Auth::id();
            $bupot->save();



            $activeCourseId = session('active_course_id');
            if ($activeCourseId) {
                $courseUser = CourseUser::where('course_id', $activeCourseId)
                    ->where('user_id', Auth::id())
                    ->first();

                if ($courseUser) {
                    CourseResult::create([
                        'course_user_id' => $courseUser->id,
                        'invoice_id' => null,
                        'retur_id' => null,
                        'other_id' => null,
                        'retur_other_id' => null,
                        'bupot_id' => $bupot->id,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            return redirect()->route('cy.notIssued')->with('success', 'eBupot Pemotongan Secara Digunggung berhasil dibuat');
        } catch (\Exception $e) {
            return redirect()->route('cy.notIssued')->with('success', 'Terjadi kesalahan saat membuat eBupot Pemotongan Secara Digunggung');
        }
    }

    public function edit($id)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            abort(403, 'Tidak ada kelas aktif.');
        }

        $bupot = Bupot::where('id', $id)
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($qr) use ($activeCourseId) {
                $qr->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $objects = MasterObject::where('type', 'digunggung')->get();
        return Inertia::render('CY/FormEditCY', [
            'user' => $user,
            'bupot' => $bupot,
            'objects' => $objects,
            'active_course_id' => $activeCourseId,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'object_id' => 'required|exists:master_objects,id',
            'bupot_period' => 'required|string|max:255',
            'bupot_year' => 'required|string|max:4',
            'bupot_status' => 'required|in:normal,perbaikan',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'nullable|string|max:255',
            'customer_country' => 'nullable|string|max:255',
            'customer_birth_date' => 'nullable|date',
            'customer_birth_place' => 'nullable|string|max:255',
            'customer_passport' => 'nullable|string|max:255',
            'customer_permit' => 'nullable|string|max:255',
            'customer_ptkp' => 'nullable|string|max:255',
            'customer_position' => 'nullable|string|max:255',
            'facility' => 'required|in:fasilitas lainnya,pph ditanggung pemerintah,tanpa fasilitas',
            'dpp' => 'required|numeric',
            'rates' => 'required|numeric',
            'tax' => 'required|numeric',
            'doc_type' => 'required|string|max:255',
            'doc_no' => 'required|string|max:255',
            'doc_date' => 'required|date',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,draft',
        ]);

        try {
            $bupot = Bupot::findOrFail($id);
            $bupot->update($validated);

            return redirect()->route('cy.notIssued')->with('success', 'eBupot Pemotongan Secara Digunggung berhasil diedit');
        } catch (\Exception $e) {
            return redirect()->route('cy.notIssued')->with('success', 'Terjadi kesalahan saat mengedit eBupot Pemotongan Secara Digunggung');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:bupot,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,draft',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('cy.notIssued')->with('error', 'Password salah!');
        }

        try {
            foreach ($validated['ids'] as $id) {
                $bupot = Bupot::findOrFail($id);
                $bupot->status = $validated['status'];
                if ($validated['status'] === 'approved') {
                    $randomString = strtoupper(substr(md5(uniqid()), 0, 4));
                    $bupot->bupot_number = "{$bupot->bupot_year}{$randomString}";
                }
                $bupot->save();
            }

            return redirect()->route('cy.issued')->with('success', 'Status eBupot berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('cy.notIssued')->with('error', 'Status eBupot gagal diperbarui.');
        }
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:bupot,id',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('cy.notIssued')->with('error', 'Password salah!');
        }

        try {
            Bupot::whereIn('id', $request->ids)->delete();

            return redirect()->route('cy.notIssued')->with('success', 'eBupot berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('cy.notIssued')->with('error', 'Gagal menghapus eBupot.');
        }
    }

    public function downloadPDF($id)
    {
        $user = Auth::user();
        $bupot = Bupot::with('object')->findOrFail($id);
        $pdf = PDF::loadView('pdf/bupot', compact('bupot', 'user'));
        return $pdf->stream('cy_' . $bupot->bupot_number . '_' . $bupot->customer_id . '.pdf');
    }
}
