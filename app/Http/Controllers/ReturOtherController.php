<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Other;
use App\Models\ReturOther;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ReturOtherController extends Controller
{
    public function export()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturDokumenPajakKeluaran/ReturDokumenPajakKeluaran', [
                'returs' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $returs = ReturOther::with('other')
            ->where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/ReturDokumenPajakKeluaran/ReturDokumenPajakKeluaran', [
            'returs' => $returs,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function import()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturDokumenPajakMasukan/ReturDokumenPajakMasukan', [
                'returs' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $returs = ReturOther::with('other')
            ->where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/ReturDokumenPajakMasukan/ReturDokumenPajakMasukan', [
            'returs' => $returs,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function createExport()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturDokumenPajakKeluaran/FormCreateExportReturn', [
                'others' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $existingOtherIds = ReturOther::where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereIn('status', ['created', 'approved'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->pluck('other_id')
            ->toArray();

        $others = Other::where('type', 'keluaran')
            ->where('status', 'approved')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereNotIn('id', $existingOtherIds)
            ->orWhere(function ($query) use ($existingOtherIds, $user, $activeCourseId) {
                $query->whereIn('id', $existingOtherIds)
                    ->where('status', 'canceled')
                    ->where('user_id', $user->id)
                    ->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                        $q2->where('course_id', $activeCourseId);
                    });
            })
            ->get();

        return Inertia::render('Invoice/ReturDokumenPajakKeluaran/FormCreateExportReturn', [
            'others' => $others,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function createImport()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturDokumenPajakMasukan/FormCreateImportReturn', [
                'others' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $existingOtherIds = ReturOther::where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereIn('status', ['created', 'approved'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->pluck('other_id')
            ->toArray();

        $others = Other::where('type', 'masukan')
            ->where('status', 'approved')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereNotIn('id', $existingOtherIds)
            ->orWhere(function ($query) use ($existingOtherIds, $user, $activeCourseId) {
                $query->whereIn('id', $existingOtherIds)
                    ->where('status', 'canceled')
                    ->where('user_id', $user->id)
                    ->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                        $q2->where('course_id', $activeCourseId);
                    });
            })
            ->get();

        return Inertia::render('Invoice/ReturDokumenPajakMasukan/FormCreateImportReturn', [
            'others' => $others,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'other_id' => 'required|string|uuid|exists:others,id',
            'retur_number' => 'required|string|max:255',
            'retur_date' => 'required|date',
            'retur_period' => 'required|string|max:255',
            'retur_year' => 'required|string|max:4',
            'dpp' => 'required|numeric',
            'dpp_lain' => 'required|numeric',
            'ppn' => 'required|numeric',
            'ppnbm' => 'required|numeric',
            'type' => 'required|in:keluaran,masukan',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
        ]);

        try {
            $retur = new ReturOther($validated);
            $retur->user_id = Auth::id();
            $retur->save();

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
                        'retur_other_id' => $retur->id,
                        'bupot_id' => null,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Membuat Retur.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal Membuat Retur.');
        }
    }

    public function editExport($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $retur = ReturOther::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $others = Other::where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();

        return inertia('Invoice/ReturDokumenPajakKeluaran/FormEditExportReturn', [
            'retur' => $retur,
            'others' => $others,
        ]);
    }

    public function editImport($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $retur = ReturOther::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $others = Other::where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();

        return inertia('Invoice/ReturDokumenPajakMasukan/FormEditImportReturn', [
            'retur' => $retur,
            'others' => $others,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'other_id' => 'required|string|uuid|exists:others,id',
            'retur_number' => 'required|string|max:255',
            'retur_date' => 'required|date',
            'retur_period' => 'required|string|max:255',
            'retur_year' => 'required|string|max:4',
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
            $retur = ReturOther::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $retur->update($validated);

            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Mengubah Retur.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Gagal Mengubah Retur.');
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
            $retur = ReturOther::findOrFail($id);
            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('retur.export')->with('error', 'No active course selected');
            }
            $retur = ReturOther::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $retur->status = $validated['status'];
            $retur->save();


            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('success', 'Status retur berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Status retur gagal diperbarui.');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:retur_other,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            $firstRetur = ReturOther::findOrFail($validated['ids'][0]);
            $redirectRoute = $firstRetur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('retur.export')->with('error', 'No active course selected');
            }
            foreach ($validated['ids'] as $id) {
                $retur = ReturOther::where('id', $id)
                    ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })
                    ->firstOrFail();
                $retur->status = $validated['status'];
                $retur->save();
            }

            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('success', 'Status retur berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.import' : 'retur.export';
            return redirect()->route($redirectRoute)->with('error', 'Status retur gagal diperbarui.');
        }
    }
}
