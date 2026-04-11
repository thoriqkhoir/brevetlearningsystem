<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Invoice;
use App\Models\Retur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ReturController extends Controller
{
    public function output()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturPajakKeluaran/ReturPajakKeluaran', [
                'returs' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $returs = Retur::with('invoice')
            ->where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/ReturPajakKeluaran/ReturPajakKeluaran', [
            'returs' => $returs,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function input()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturPajakMasukan/ReturPajakMasukan', [
                'returs' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $returs = Retur::with('invoice')
            ->where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/ReturPajakMasukan/ReturPajakMasukan', [
            'returs' => $returs,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturPajakKeluaran/FormCreateOutputReturn', [
                'invoices' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $existingInvoiceIds = Retur::where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereIn('status', ['created', 'approved'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->pluck('invoice_id')
            ->toArray();

        $invoices = Invoice::where('type', 'keluaran')
            ->where('status', 'approved')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereNotIn('id', $existingInvoiceIds)
            ->orWhere(function ($query) use ($existingInvoiceIds, $user, $activeCourseId) {
                $query->whereIn('id', $existingInvoiceIds)
                    ->where('status', 'canceled')
                    ->where('user_id', $user->id)
                    ->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                        $q2->where('course_id', $activeCourseId);
                    });
            })
            ->get();

        return Inertia::render('Invoice/ReturPajakKeluaran/FormCreateOutputReturn', [
            'invoices' => $invoices,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function createInput()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/ReturPajakMasukan/FormCreateInputReturn', [
                'invoices' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $existingInvoiceIds = Retur::where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereIn('status', ['created', 'approved'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->pluck('invoice_id')
            ->toArray();

        $invoices = Invoice::where('type', 'masukan')
            ->where('status', 'credit')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereNotIn('id', $existingInvoiceIds)
            ->orWhere(function ($query) use ($existingInvoiceIds, $user, $activeCourseId) {
                $query->whereIn('id', $existingInvoiceIds)
                    ->where('status', 'canceled')
                    ->where('user_id', $user->id)
                    ->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                        $q2->where('course_id', $activeCourseId);
                    });
            })
            ->get();

        return Inertia::render('Invoice/ReturPajakMasukan/FormCreateInputReturn', [
            'invoices' => $invoices,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'invoice_id' => 'required|string|uuid|exists:invoices,id',
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
            $retur = new Retur($validated);
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
                        'retur_id' => $retur->id,
                        'other_id' => null,
                        'retur_other_id' => null,
                        'bupot_id' => null,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Membuat Retur.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('error', 'Gagal Membuat Retur.');
        }
    }

    public function edit($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $retur = Retur::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $invoices = Invoice::where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();

        return inertia('Invoice/ReturPajakKeluaran/FormEditOutputReturn', [
            'retur' => $retur,
            'invoices' => $invoices,
        ]);
    }

    public function editInput($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $retur = Retur::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $invoices = Invoice::where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();

        return inertia('Invoice/ReturPajakMasukan/FormEditInputReturn', [
            'retur' => $retur,
            'invoices' => $invoices,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'invoice_id' => 'required|string|uuid|exists:invoices,id',
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
            $retur = Retur::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $retur->update($validated);

            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Mengubah Retur.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
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
            $retur = Retur::findOrFail($id);
            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('retur.output')->with('error', 'No active course selected');
            }
            $retur = Retur::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $retur->status = $validated['status'];
            $retur->save();


            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('success', 'Status retur berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('error', 'Status retur gagal diperbarui.');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:retur,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            $firstRetur = Retur::findOrFail($validated['ids'][0]);
            $redirectRoute = $firstRetur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('retur.output')->with('error', 'No active course selected');
            }
            foreach ($validated['ids'] as $id) {
                $retur = Retur::where('id', $id)
                    ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })
                    ->firstOrFail();
                $retur->status = $validated['status'];
                $retur->save();
            }

            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('success', 'Status retur berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $retur->type === 'masukan' ? 'retur.input' : 'retur.output';
            return redirect()->route($redirectRoute)->with('error', 'Status retur gagal diperbarui.');
        }
    }
}
