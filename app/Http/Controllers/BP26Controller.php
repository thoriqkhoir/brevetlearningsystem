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

class BP26Controller extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('BP26/NotIssued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft'])
            ->whereHas('object', function ($query) {
                $query->where('type', 'bpnr');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BP26/NotIssued', [
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
            return Inertia::render('BP26/Issued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereHas('object', function ($query) {
                $query->where('type', 'bpnr');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BP26/Issued', [
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
            return Inertia::render('BP26/Invalid', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'canceled')
            ->whereHas('object', function ($query) {
                $query->where('type', 'bpnr');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BP26/Invalid', [
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
            abort(403, 'No active course selected');
        }
        $bupot = Bupot::with('object')
            ->where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        return Inertia::render('BP26/BP26', [
            'user' => $user,
            'bupot' => $bupot,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('BP26/FormCreateBP26', [
                'user' => $user,
                'objects' => [],
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $objects = MasterObject::where('type', 'bpnr')->get();
        $bupots = Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft', 'approved'])
            ->whereHas('object', function ($query) {
                $query->where('type', 'bpnr');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();
        return Inertia::render('BP26/FormCreateBP26', [
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

            return redirect()->route('bp26.notIssued')->with('success', 'e-Bupot BP26 berhasil dibuat');
        } catch (\Exception $e) {
            return redirect()->route('bp26.notIssued')->with('success', 'Terjadi kesalahan saat membuat e-Bupot BP26');
        }
    }

    public function edit($id)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $bupot = Bupot::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $objects = MasterObject::where('type', 'bpnr')->get();
        return Inertia::render('BP26/FormEditBP26', [
            'user' => $user,
            'bupot' => $bupot,
            'objects' => $objects,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
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
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                abort(403, 'No active course selected');
            }
            $bupot = Bupot::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $bupot->update($validated);

            return redirect()->route('bp26.notIssued')->with('success', 'e-Bupot BP26 berhasil diedit');
        } catch (\Exception $e) {
            return redirect()->route('bp26.notIssued')->with('success', 'Terjadi kesalahan saat mengedit e-Bupot BP26');
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

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('bp26.notIssued')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('bp26.notIssued')->with('error', 'Password salah!');
        }

        try {
            foreach ($validated['ids'] as $id) {
                $bupot = Bupot::where('id', $id)
                    ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })
                    ->firstOrFail();
                $bupot->status = $validated['status'];
                if ($validated['status'] === 'approved') {
                    $randomString = strtoupper(substr(md5(uniqid()), 0, 4));
                    $bupot->bupot_number = "{$bupot->bupot_year}{$randomString}";
                }
                $bupot->save();
            }

            return redirect()->route('bp26.issued')->with('success', 'Status e-Bupot BP26 berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('bp26.notIssued')->with('error', 'Status e-Bupot BP26 gagal diperbarui.');
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

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('bp26.notIssued')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('bp26.notIssued')->with('error', 'Password salah!');
        }

        try {
            Bupot::whereIn('id', $request->ids)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->delete();

            return redirect()->route('bp26.notIssued')->with('success', 'e-Bupot BP26 berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('bp26.notIssued')->with('error', 'Gagal menghapus e-Bupot BP26.');
        }
    }

    public function downloadPDF($id)
    {
        $user = Auth::user();
        $bupot = Bupot::with('object')->findOrFail($id);
        $pdf = PDF::loadView('pdf/bupot', compact('bupot', 'user'));
        return $pdf->stream('bp26_' . $bupot->bupot_number . '_' . $bupot->customer_id . '.pdf');
    }
}
