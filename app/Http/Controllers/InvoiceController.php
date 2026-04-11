<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\MasterItem;
use App\Models\MasterTransaction;
use App\Models\MasterUnit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/Dashboard', [
                'invoices' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $invoices = Invoice::with('transaction')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->get();
        return Inertia::render('Invoice/Dashboard', [
            'invoices' => $invoices,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function output()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/PajakKeluaran/PajakKeluaran', [
                'invoices' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $invoices = Invoice::with('transaction')
            ->where('user_id', $user->id)
            ->where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/PajakKeluaran/PajakKeluaran', [
            'invoices' => $invoices,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function input()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/PajakMasukan/PajakMasukan', [
                'invoices' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $invoices = Invoice::with('transaction')
            ->where('user_id', $user->id)
            ->where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Invoice/PajakMasukan/PajakMasukan', [
            'invoices' => $invoices,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function create()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/PajakKeluaran/FormCreateOutputInvoice', [
                'transactions' => [],
                'itemTransactions' => [],
                'unitTransactions' => [],
                'invoiceCount' => 0,
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        $transactions = MasterTransaction::all();
        $itemTransactions = MasterItem::all();
        $unitTransactions = MasterUnit::all();
        $invoiceCount = Invoice::where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->count();
        return Inertia::render('Invoice/PajakKeluaran/FormCreateOutputInvoice', [
            'transactions' => $transactions,
            'itemTransactions' => $itemTransactions,
            'unitTransactions' => $unitTransactions,
            'invoiceCount' => $invoiceCount,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function createInput()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Invoice/PajakMasukan/FormCreateInputInvoice', [
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }
        return Inertia::render('Invoice/PajakMasukan/FormCreateInputInvoice', [
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'transaction_id' => 'required|exists:master_transactions,id',
            'transaction_code' => 'required|string|max:255',
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'invoice_period' => 'required|string|max:255',
            'invoice_year' => 'required|string|max:4',
            'invoice_reference' => 'nullable|string|max:255',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'dpp' => 'required|numeric',
            'dpp_lain' => 'required|numeric',
            'ppn' => 'required|numeric',
            'ppnbm' => 'required|numeric',
            'dpp_split' => 'nullable|numeric',
            'ppn_split' => 'nullable|numeric',
            'ppnbm_split' => 'nullable|numeric',
            'correction_number' => 'required|integer',
            'type' => 'required|in:keluaran,masukan',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,credit,uncredit',
            'payment_type' => 'nullable|in:lunas,uang muka,pelunasan',
            'credit_date' => 'nullable|date',

            'items' => 'nullable|array',
            'items.*.item_type' => 'required|in:barang,jasa',
            'items.*.item_id' => 'required|exists:master_items,id',
            'items.*.unit_id' => 'required|exists:master_units,id',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.item_quantity' => 'required|integer',
            'items.*.item_price' => 'required|integer',
            'items.*.item_discount' => 'required|integer',
            'items.*.dpp' => 'required|integer',
            'items.*.dpp_lain' => 'required|integer',
            'items.*.ppn' => 'required|integer',
            'items.*.ppnbm_rate' => 'required|integer',
            'items.*.ppnbm' => 'required|integer',
        ]);

        try {
            $invoice = new Invoice($validated);
            $invoice->user_id = Auth::id();
            $invoice->save();

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'item_type' => $item['item_type'],
                        'item_id' => $item['item_id'],
                        'unit_id' => $item['unit_id'],
                        'item_name' => $item['item_name'],
                        'item_quantity' => $item['item_quantity'],
                        'item_price' => $item['item_price'],
                        'item_discount' => $item['item_discount'],
                        'dpp' => $item['dpp'],
                        'dpp_lain' => $item['dpp_lain'],
                        'ppn' => $item['ppn'],
                        'ppnbm_rate' => $item['ppnbm_rate'],
                        'ppnbm' => $item['ppnbm'],
                    ]);
                }
            }

            $activeCourseId = session('active_course_id');
            if ($activeCourseId) {
                $courseUser = CourseUser::where('course_id', $activeCourseId)
                    ->where('user_id', Auth::id())
                    ->first();

                if ($courseUser) {
                    CourseResult::create([
                        'course_user_id' => $courseUser->id,
                        'invoice_id' => $invoice->id,
                        'retur_id' => null,
                        'other_id' => null,
                        'retur_other_id' => null,
                        'bupot_id' => null,
                        'spt_id' => null,
                        'score' => null,
                    ]);
                }
            }

            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Membuat Faktur.');
        } catch (\Exception $e) {
            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('error', 'Gagal Membuat Faktur.');
        }
    }

    public function edit($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $invoice = Invoice::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $items = InvoiceItem::where('invoice_id', $id)->get();
        $transactions = MasterTransaction::all();
        $itemTransactions = MasterItem::all();
        $unitTransactions = MasterUnit::all();
        $invoiceCount = Invoice::where('type', 'keluaran')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->count();

        return inertia('Invoice/PajakKeluaran/FormEditOutputInvoice', [
            'invoice' => $invoice,
            'items' => $items,
            'transactions' => $transactions,
            'itemTransactions' => $itemTransactions,
            'unitTransactions' => $unitTransactions,
            'invoiceCount' => $invoiceCount,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function editInput($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'No active course selected');
        }
        $invoice = Invoice::where('id', $id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->firstOrFail();
        $items = InvoiceItem::where('invoice_id', $id)->get();
        $invoiceCount = Invoice::where('type', 'masukan')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->count();
        return Inertia::render('Invoice/PajakMasukan/FormEditInputInvoice', [
            'invoice' => $invoice,
            'items' => $items,
            'invoiceCount' => $invoiceCount
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id' => 'required|string|uuid',
            'transaction_id' => 'required|exists:master_transactions,id',
            'transaction_code' => 'required|string|max:255',
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'invoice_period' => 'required|string|max:255',
            'invoice_year' => 'required|string|max:4',
            'invoice_reference' => 'nullable|string|max:255',
            'customer_id' => 'required|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'dpp' => 'required|numeric',
            'dpp_lain' => 'required|numeric',
            'ppn' => 'required|numeric',
            'ppnbm' => 'required|numeric',
            'dpp_split' => 'nullable|numeric',
            'ppn_split' => 'nullable|numeric',
            'ppnbm_split' => 'nullable|numeric',
            'correction_number' => 'required|integer',
            'type' => 'required|in:keluaran,masukan',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,credit,uncredit',
            'payment_type' => 'nullable|in:lunas,uang muka,pelunasan',
            'credit_date' => 'nullable|date',

            'items' => 'nullable|array',
            'items.*.id' => 'nullable|exists:invoice_items,id',
            'items.*.item_type' => 'required|in:barang,jasa',
            'items.*.item_id' => 'required|exists:master_items,id',
            'items.*.unit_id' => 'required|exists:master_units,id',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.item_quantity' => 'required|integer',
            'items.*.item_price' => 'required|integer',
            'items.*.item_discount' => 'required|integer',
            'items.*.dpp' => 'required|integer',
            'items.*.dpp_lain' => 'required|integer',
            'items.*.ppn' => 'required|integer',
            'items.*.ppnbm_rate' => 'required|integer',
            'items.*.ppnbm' => 'required|integer',
        ]);

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                abort(403, 'No active course selected');
            }
            $invoice = Invoice::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $invoice->update($validated);

            $existingItemIds = InvoiceItem::where('invoice_id', $invoice->id)->pluck('id')->toArray();
            $updatedItemIds = array_column($validated['items'], 'id');

            $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
            InvoiceItem::whereIn('id', $itemsToDelete)->delete();

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    InvoiceItem::updateOrCreate(
                        ['id' => $item['id'] ?? null, 'invoice_id' => $invoice->id],
                        $item
                    );
                }
            }

            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('success', 'Berhasil Mengubah Faktur.');
        } catch (\Exception $e) {
            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('error', 'Gagal Mengubah Faktur.');
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
            $invoice = Invoice::findOrFail($id);
            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('error', 'Password salah!');
        }

        try {
            $activeCourseId = session('active_course_id');
            if (!$activeCourseId) {
                return redirect()->route('invoice.output')->with('error', 'No active course selected');
            }
            $invoice = Invoice::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $invoice->status = $validated['status'];
            $invoice->save();

            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('success', 'Status faktur berhasil diperbarui.');
        } catch (\Exception $e) {
            $redirectRoute = $invoice->type === 'masukan' ? 'invoice.input' : 'invoice.output';
            return redirect()->route($redirectRoute)->with('error', 'Status faktur gagal diperbarui.');
        }
    }

    public function updateStatusMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:invoices,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('invoice.output')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('invoice.output')->with('error', 'Password salah!');
        }

        foreach ($validated['ids'] as $id) {
            $invoice = Invoice::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $invoice->status = $validated['status'];
            $invoice->save();
        }

        return redirect()->route('invoice.output')->with('success', 'Status faktur berhasil diperbarui.');
    }

    public function updateStatusInputMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string|uuid|exists:invoices,id',
            'status' => 'required|in:created,approved,canceled,deleted,amanded,credit,uncredit',
            'credit_date' => 'nullable|date',
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('invoice.input')->with('error', 'No active course selected');
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('invoice.input')->with('error', 'Password salah!');
        }

        foreach ($validated['ids'] as $id) {
            $invoice = Invoice::where('id', $id)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->firstOrFail();
            $invoice->status = $validated['status'];
            if ($validated['status'] === 'credit' || $validated['status'] === 'uncredit') {
                $invoice->credit_date = $validated['credit_date'];
            } elseif ($validated['status'] === 'approved') {
                $invoice->credit_date = null;
            }
            $invoice->save();
        }

        return redirect()->route('invoice.input')->with('success', 'Status faktur berhasil diperbarui.');
    }

    public function downloadPDF($id)
    {
        $user = Auth::user();
        $invoice = Invoice::with('items')->findOrFail($id);
        $pdf = PDF::loadView('pdf/faktur', compact('invoice', 'user'));
        return $pdf->stream('faktur_keluaran_' . $invoice->customer_name . '.pdf');
    }
}
