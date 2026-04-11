<?php

namespace App\Http\Controllers;

use App\Models\BupotA1;
use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\MasterTer;
use App\Models\MasterObject;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BPA1Controller extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        if (!$activeCourseId) {
            return Inertia::render('BPA1/NotIssued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = BupotA1::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft'])
            ->whereHas('object', function ($query) {
                $query->where('type', 'pegawai');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BPA1/NotIssued', [
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
            return Inertia::render('BPA1/Issued', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = BupotA1::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereHas('object', function ($query) {
                $query->where('type', 'pegawai');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BPA1/Issued', [
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
            return Inertia::render('BPA1/Invalid', [
                'bupots' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $bupots = BupotA1::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'canceled')
            ->whereHas('object', function ($query) {
                $query->where('type', 'pegawai');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('BPA1/Invalid', [
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
            $bupot = BupotA1::with('object')
                ->where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            
            return Inertia::render('BPA1/BPA1', [
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
            return Inertia::render('BPA1/FormCreateBPA1', [
                'user' => $user,
                'objects' => [],
                'bupots' => [],
                'ter' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $objects = MasterObject::where('type', 'pegawai')->get();
        $bupots = BupotA1::with('object')
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'draft', 'approved'])
            ->whereHas('object', function ($query) {
                $query->where('type', 'pegawai');
            })
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();
        $ter = MasterTer::all();
        return Inertia::render('BPA1/FormCreateBPA1', [
            'user' => $user,
            'objects' => $objects,
            'bupots' => $bupots,
            'ter' => $ter,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Tidak perlu validasi id karena akan menggunakan auto-increment dari database
            'object_id' => 'required|exists:master_objects,id',
            'is_more' => 'required|in:ya,tidak',
            'start_period' => 'required|string|max:255',
            'end_period' => 'required|string|max:255',
            'bupot_status' => 'required|in:normal,perbaikan',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'required|string',
            'customer_passport' => 'nullable|string|max:255',
            'customer_country' => 'nullable|string|max:255',
            'customer_gender' => 'required|string|max:255',
            'customer_ptkp' => 'required|string|max:255',
            'customer_position' => 'required|string|max:255',
            'tax_type' => 'required|string|max:255',
            'tax_code' => 'required|string|max:255',
            'bupot_types' => 'required|string|max:255',
            //bruto
            'basic_salary' => 'required|numeric|min:0',
            'is_gross' => 'required|boolean',
            'tax_allowance' => 'nullable|numeric|min:0',
            'other_allowance' => 'nullable|numeric|min:0',
            'honorarium' => 'nullable|numeric|min:0',
            'premi' => 'nullable|numeric|min:0',
            'in_kind_acceptance' => 'nullable|numeric|min:0',
            'tantiem' => 'nullable|numeric|min:0',
            'gross_income_amount' => 'required|numeric|min:0',
            //pengurang
            'position_allowance' => 'required|numeric|min:0',
            'pension_contribution' => 'required|numeric|min:0',
            'zakat' => 'nullable|numeric|min:0',
            'amount_of_reduction' => 'required|numeric|min:0',
            //neto
            'neto' => 'required|numeric|min:0',
            'before_neto' => 'nullable|numeric|min:0',
            'total_neto' => 'nullable|numeric|min:0',
            'non_taxable_income' => 'required|numeric|min:0',
            'taxable_income' => 'nullable|numeric|min:0',
            'pph_taxable_income' => 'required|numeric|min:0',
            'pph_owed' => 'nullable|numeric|min:0',
            'pph_deducted' => 'required|numeric|min:0',
            'pph_deducted_withholding' => 'required|numeric|min:0',
            'pph_government' => 'required|numeric|min:0',
            'pph_desember' => 'required|numeric',
            'facility' => 'required|in:tanpa fasilitas,ditanggung pemerintah,fasilitas lain',
            'kap' => 'required|string|max:255',
            'nitku' => 'required|string|max:255',
            'status' => 'required|in:created,approved,canceled,deleted,draft',
        ]);

        try {
            $bupot = new BupotA1($validated);
            $bupot->user_id = Auth::id();

            // Generate bupot_number untuk semua status
            $randomString = strtoupper(substr(md5(uniqid()), 0, 8));
            $bupot->bupot_number = "$randomString";

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
                        'bupot_id' => null,
                        'bupot_a1_id' => $bupot->id,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            return redirect()->route('bpa1.notIssued')->with('success', 'BPA1 berhasil dibuat');
        } catch (\Exception $e) {
            Log::error('Error creating BPA1: ' . $e->getMessage());
            return redirect()->route('bpa1.notIssued')->with('error', 'Terjadi kesalahan saat membuat BPA1: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $bupot = BupotA1::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $objects = MasterObject::where('type', 'pegawai')->get();
        $ter = MasterTer::all();
        return Inertia::render('BPA1/FormEditBPA1', [
            'user' => $user,
            'bupot' => $bupot,
            'objects' => $objects,
            'ter' => $ter,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'object_id' => 'required|exists:master_objects,id',
            'is_more' => 'required|in:ya,tidak',
            'start_period' => 'required|string|max:255',
            'end_period' => 'required|string|max:255',
            'bupot_status' => 'required|in:normal,perbaikan',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'customer_passport' => 'nullable|string|max:255',
            'customer_country' => 'nullable|string|max:255',
            'customer_gender' => 'required|string|max:255',
            'customer_ptkp' => 'required|string|max:255',
            'customer_position' => 'required|string|max:255',
            'tax_type' => 'required|string|max:255',
            'tax_code' => 'required|string|max:255',
            'bupot_types' => 'required|string|max:255',
            'basic_salary' => 'nullable|numeric',
            'is_gross' => 'nullable|boolean',
            'tax_allowance' => 'nullable|numeric',
            'other_allowance' => 'nullable|numeric',
            'honorarium' => 'nullable|numeric',
            'premi' => 'nullable|numeric',
            'in_kind_acceptance' => 'nullable|numeric',
            'tantiem' => 'nullable|numeric',
            'gross_income_amount' => 'nullable|numeric',
            'position_allowance' => 'nullable|numeric',
            'pension_contribution' => 'nullable|numeric',
            'zakat' => 'nullable|numeric',
            'amount_of_reduction' => 'nullable|numeric',
            'neto' => 'nullable|numeric',
            'before_neto' => 'nullable|numeric',
            'total_neto' => 'nullable|numeric',
            'non_taxable_income' => 'nullable|numeric',
            'taxable_income' => 'nullable|numeric',
            'pph_taxable_income' => 'nullable|numeric',
            'pph_owed' => 'nullable|numeric',
            'pph_deducted' => 'nullable|numeric',
            'pph_deducted_withholding' => 'nullable|numeric',
            'pph_government' => 'nullable|numeric',
            'pph_desember' => 'nullable|numeric',
            'facility' => 'required|in:fasilitas lainnya,pph ditanggung pemerintah,tanpa fasilitas',
            'kap' => 'required|string|max:255',
            'nitku' => 'required|string|max:255',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,draft',
        ]);

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                abort(403, 'No active course selected');
            }
            $bupot = BupotA1::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();

            if ($validated['status'] === 'approved') {
            $validated['bupot_status'] = 'perbaikan';
            }
            $bupot->update($validated);

            $redirectRoute = match($bupot->status) {
                'approved' => 'bpa1.issued',
                'draft' => 'bpa1.invalid',
                default => 'bpa1.notIssued',
            };

            return redirect()->route($redirectRoute)->with('success', 'eBupot BPA1 berhasil diedit');
        } catch (\Exception $e) {
            return redirect()->route('bpa1.notIssued')->with('success', 'Terjadi kesalahan saat mengedit eBupot BPA1');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:bupot_a1,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,draft',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('bpa1.notIssued')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('bpa1.notIssued')->with('error', 'Password salah!');
        }

        try {
            foreach ($validated['ids'] as $id) {
                $bupot = BupotA1::where('id', $id)
                    ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })
                    ->firstOrFail();
                $bupot->status = $validated['status'];
                if ($validated['status'] === 'approved') {
                    $randomString = strtoupper(substr(md5(uniqid()), 0, 8));
                    $bupot->bupot_number = $randomString;
                }
                $bupot->save();
            }

            return redirect()->route('bpa1.issued')->with('success', 'Status eBupot BPA1 berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->route('bpa1.notIssued')->with('error', 'Status eBupot BPA1 gagal diperbarui.');
        }
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:bupot_a1,id',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('bpa1.notIssued')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('bpa1.notIssued')->with('error', 'Password salah!');
        }

        try {
            // Ubah status menjadi cancelled instead of delete hanya untuk bupot dalam active course
            BupotA1::whereIn('id', $request->ids)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->update(['status' => 'canceled']);

            return redirect()->route('bpa1.invalid')->with('success', 'eBupot BPA1 berhasil dibatalkan.');
        } catch (\Exception $e) {
            return redirect()->route('bpa1.notIssued')->with('error', 'Gagal membatalkan eBupot BPA1.');
        }
    }

    public function downloadPDF($id)
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        
        $bupot = BupotA1::with('object')
            ->where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        
        $pdf = PDF::loadView('pdf.bpa1', compact('bupot', 'user'));
        
        return $pdf->stream('bpa1_' . $bupot->bupot_number . '_' . $bupot->customer_id . '.pdf');
    }
}