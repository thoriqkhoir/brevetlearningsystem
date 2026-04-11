<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Other;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class OtherController extends Controller
{
    public function export()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/DokumenPajakKeluaran/DokumenPajakKeluaran', [
                'others' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $others = Other::where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/DokumenPajakKeluaran/DokumenPajakKeluaran', [
            'others' => $others,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function import()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/DokumenPajakMasukan/DokumenPajakMasukan', [
                'others' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $others = Other::where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/DokumenPajakMasukan/DokumenPajakMasukan', [
            'others' => $others,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function create()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/DokumenPajakKeluaran/FormCreateExportInvoice', [
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        return Inertia::render('Invoice/DokumenPajakKeluaran/FormCreateExportInvoice', [
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function createImport()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/DokumenPajakMasukan/FormCreateImportInvoice', [
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        return Inertia::render('Invoice/DokumenPajakMasukan/FormCreateImportInvoice', [
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'transaction_type' => 'required|string|max:255',
            'transaction_detail' => 'required|string|max:255',
            'transaction_doc' => 'required|string|max:255',
            'other_no' => 'required|string|max:255',
            'other_date' => 'required|date',
            'other_period' => 'required|string|max:255',
            'other_year' => 'required|string|max:4',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'dpp' => 'required|numeric',
            'dpp_lain' => 'required|numeric',
            'ppn' => 'required|numeric',
            'ppnbm' => 'required|numeric',
            'type' => 'required|in:keluaran,masukan',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
        ]);

        try {
            $other = new Other($validated);
            $other->user_id = Auth::id();
            $other->save();

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
                        'other_id' => $other->id,
                        'retur_other_id' => null,
                        'bupot_id' => null,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil membuat dokumen.');
        } catch (\Exception $e) {
            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal membuat dokumen.');
        }
    }

    public function edit($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $other = Other::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        return Inertia::render('Invoice/DokumenPajakKeluaran/FormEditExportInvoice', [
            'other' => $other,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function editImport($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $other = Other::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        return Inertia::render('Invoice/DokumenPajakMasukan/FormEditImportInvoice', [
            'other' => $other,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'transaction_type' => 'required|string|max:255',
            'transaction_detail' => 'required|string|max:255',
            'transaction_doc' => 'required|string|max:255',
            'other_no' => 'required|string|max:255',
            'other_date' => 'required|date',
            'other_period' => 'required|string|max:255',
            'other_year' => 'required|string|max:4',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'dpp' => 'required|numeric',
            'dpp_lain' => 'required|numeric',
            'ppn' => 'required|numeric',
            'ppnbm' => 'required|numeric',
            'type' => 'required|in:keluaran,masukan',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
        ]);

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                abort(403, 'No active course selected');
            }
            $other = Other::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $other->update($validated);

            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('success', 'Dokumen berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal memperbarui dokumen.');
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            $other = Other::findOrFail($id);
            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('other.export')->with('error', 'No active course selected');
            }
            $other = Other::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $other->status = $validated['status'];
            $other->save();

            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('success', 'Status dokumen berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal memperbarui status dokumen.');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:others,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            $firstOther = Other::findOrFail($validated['ids'][0]);
            $redirectRoute = $firstOther->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('other.export')->with('error', 'No active course selected');
            }
            foreach ($validated['ids'] as $id) {
                $other = Other::where('id', $id)
                    ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })
                    ->firstOrFail();
                $other->status = $validated['status'];
                $other->save();
            }

            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('success', 'Status dokumen berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $other->type === 'masukan' ? 'other.import' : 'other.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal memperbarui status dokumen.');
        }
    }
}
