<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\Ledger;
use App\Models\MasterBillingPayment;
use App\Models\MasterBillingType;
use App\Models\Spt2126;
use App\Models\Spt2126Detail;
use App\Models\Spt;
use App\Models\SptInduk;
use App\Models\SptPpn;
use App\Models\SptUnifikasi;
use App\Models\SptUnifikasiDetail;
use App\Models\CourseUser;
use App\Models\CourseResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('Payment/LayananMandiri', [
                'user' => Auth::user(),
                'billingTypes' => [],
                'billingPayments' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $billingTypes = MasterBillingType::all();
        $billingPayments = MasterBillingPayment::all();
        return Inertia::render('Payment/LayananMandiri', [
            'user' => $user,
            'billingTypes' => $billingTypes,
            'billingPayments' => $billingPayments,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }
    public function store(Request $request)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('payment.billing')->with('error', 'Active course belum dipilih.');
        }
        // Generate billing_form_id auto increment
        $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
        $billingFormId = $lastBillingFormId + 1;

        $validated = $request->validate([
            'spt_id' => 'nullable|exists:spt,id',
            'billing_type_id' => 'required|exists:master_billing_types,id',
            'billing_payment_id' => 'nullable|exists:master_billing_payments,id',
            'start_period' => 'required|string|max:255',
            'end_period' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'currency' => 'nullable|string|max:255',
            'amount' => 'required|integer|min:0',
            'amount_in_words' => 'nullable|string|max:255',
            'period_for' => 'nullable|string|max:255',
            'year_for' => 'nullable|string|max:4',
            'description' => 'nullable|string|max:255',
            'status' => 'required|in:paid,unpaid',
            'active_period' => 'required|date',
            'code' => 'required|string|max:255',
        ]);

        try {
            // Tambahkan billing_form_id ke validated data
            $validated['billing_form_id'] = $billingFormId;
            $validated['user_id'] = Auth::id();

            // Jika ada spt_id pastikan SPT berada dalam active course
            if (!empty($validated['spt_id'])) {
                $scopedSpt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })->find($validated['spt_id']);
                if (!$scopedSpt) {
                    return redirect()->route('payment.billing')->with('error', 'SPT tidak ditemukan dalam kelas aktif.');
                }
            }

            // Create billing
            $billing = Billing::create($validated);

            // Ensure course_user exists and attach billing via course_results for scoping
            $courseUser = $this->ensureCourseUser(Auth::id(), $activeCourseId);
            $this->attachBillingToCourse($billing, $courseUser);

            return redirect()->route('payment.billing')->with('success', 'Billing berhasil disimpan.');
        } catch (\Exception $e) {
            Log::error('Error creating billing: ' . $e->getMessage());
            return redirect()->route('payment.billing')->with('error', 'Gagal menyimpan billing: ' . $e->getMessage());
        }
    }
    public function storeDeposit(Request $request)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('payment.billingDeposit')->with('error', 'Active course belum dipilih.');
        }
        // Generate billing_form_id auto increment
        $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
        $billingFormId = $lastBillingFormId + 1;

        $validated = $request->validate([
            'spt_id' => 'nullable|exists:spt,id',
            'billing_type_id' => 'required|exists:master_billing_types,id',
            'billing_payment_id' => 'nullable|exists:master_billing_payments,id',
            'start_period' => 'required|string|max:255',
            'end_period' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'currency' => 'nullable|string|max:255',
            'amount' => 'required|integer|min:0',
            'amount_in_words' => 'nullable|string|max:255',
            'period_for' => 'nullable|string|max:255',
            'year_for' => 'nullable|string|max:4',
            'description' => 'nullable|string|max:255',
            'status' => 'required|in:paid,unpaid',
            'active_period' => 'required|date',
            'code' => 'required|string|max:255',
        ]);

        try {
            // Tambahkan billing_form_id ke validated data
            $validated['billing_form_id'] = $billingFormId;
            $validated['user_id'] = Auth::id();

            if (!empty($validated['spt_id'])) {
                $scopedSpt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })->find($validated['spt_id']);
                if (!$scopedSpt) {
                    return redirect()->route('payment.billingDeposit')->with('error', 'SPT tidak ditemukan dalam kelas aktif.');
                }
            }

            $billing = Billing::create($validated);

            // Attach deposit billing to course scope
            $courseUser = $this->ensureCourseUser(Auth::id(), $activeCourseId);
            $this->attachBillingToCourse($billing, $courseUser);

            return redirect()->route('payment.billingDeposit')->with('success', 'Billing berhasil disimpan.');
        } catch (\Exception $e) {
            Log::error('Error creating billing: ' . $e->getMessage());
            return redirect()->route('payment.billingDeposit')->with('error', 'Gagal menyimpan billing: ' . $e->getMessage());
        }
    }

    public function billing()
    {
        $activeCourseId = session('active_course_id');
        $user = Auth::user();
        if (!$activeCourseId) {
            return Inertia::render('Payment/DaftarBilling', [
                'billingGroups' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        // Group billing berdasarkan billing_form_id menggunakan course scoping lewat course_results
        // includeUnlinked = true agar billing lama yang belum punya course_results tetap tampil
        $billingGroups = Billing::with(['user', 'billingType'])
            ->forUserAndCourseSmart($user->id, $activeCourseId)
            ->where('status', 'unpaid')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('billing_form_id');

        // Transform ke format yang mudah digunakan di frontend
        $groupedBillings = $billingGroups->map(function ($billings, $formId) {
            $firstBilling = $billings->first();
            $totalAmount = $billings->sum('amount');
            $billingCount = $billings->count();

            // Tentukan description berdasarkan jumlah billing
            if ($billingCount > 1) {
                $description = "SPT Masa PPh Unifikasi periode {$firstBilling->start_period} {$firstBilling->year}";
            } else {
                $description = $firstBilling->billingType->description . " Periode {$firstBilling->start_period} {$firstBilling->year}";
            }


            return [
                'billing_form_id' => $formId,
                'user' => [
                    'name' => $firstBilling->user->name,
                    'npwp' => $firstBilling->user->npwp,
                ],
                'code' => $firstBilling->code,
                'currency' => $firstBilling->currency,
                'amount' => $totalAmount, // Total amount dari semua billing dalam group
                'active_period' => $firstBilling->active_period,
                'billing_count' => $billings->count(),
                'start_period' => $firstBilling->start_period,
                'year' => $firstBilling->year,
                'description' => $description,
                'billings' => $billings->toArray(), // Detail semua billing dalam group
            ];
        })->values();

        return Inertia::render('Payment/DaftarBilling', [
            'billingGroups' => $groupedBillings,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function payBillingGroup(Request $request, $billingFormId)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('payment.billing')->with('error', 'Active course belum dipilih.');
        }
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($validated['password'], $user->password)) {
            return redirect()->route('payment.billing')->with('error', 'Password salah!');
        }

        // Ambil semua billing dengan billing_form_id yang sama & scope course
        $billings = Billing::byBillingForm($billingFormId)
            ->forUserAndCourseSmart($user->id, $activeCourseId)
            ->where('status', 'unpaid')
            ->get();

        if ($billings->isEmpty()) {
            return redirect()->route('payment.billing')->with('error', 'Tidak ada billing yang belum dibayar.');
        }

        try {
            $totalAmount = 0;
            $sptIds = [];

            // Update status semua billing dalam group
            foreach ($billings as $billing) {
                $billing->status = 'paid';
                $billing->save();

                $totalAmount += $billing->amount;

                // Kumpulkan SPT IDs untuk update status
                if ($billing->spt_id && !in_array($billing->spt_id, $sptIds)) {
                    $sptIds[] = $billing->spt_id;
                }

                // Buat ledger untuk setiap billing
                $this->createLedgerForBilling($billing, $user);
            }

            // Update status SPT
            foreach ($sptIds as $sptId) {
                $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })->find($sptId);
                if ($spt && $spt->status === 'waiting') {
                    $spt->status = 'approved';
                    $spt->payment_value = $totalAmount;
                    $spt->paid_date = now();
                    $spt->save();
                }
            }

            return redirect()->route('payment.billing')->with('success', 'Semua billing dalam grup berhasil dibayar.');
        } catch (\Exception $e) {
            Log::error('Error saat membayar billing group: ' . $e->getMessage());
            return redirect()->route('payment.billing')->with('error', $e->getMessage());
        }
    }

    public function deleteBillingGroup(Request $request, $billingFormId)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('payment.billing')->with('error', 'Active course belum dipilih.');
        }

        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();
        if (!Hash::check($validated['password'], $user->password)) {
            return redirect()->route('payment.billing')->with('error', 'Password salah!');
        }

        // Ambil semua billing unpaid dengan billing_form_id yang sama & scope course
        $billings = Billing::byBillingForm($billingFormId)
            ->forUserAndCourseSmart($user->id, $activeCourseId)
            ->where('status', 'unpaid')
            ->get();

        if ($billings->isEmpty()) {
            return redirect()->route('payment.billing')->with('error', 'Tidak ada billing yang belum dibayar.');
        }

        try {
            DB::transaction(function () use ($billings, $activeCourseId) {
                $sptIds = $billings->pluck('spt_id')->filter()->unique()->values();
                $billingIds = $billings->pluck('id');

                Billing::whereIn('id', $billingIds)->delete();

                foreach ($sptIds as $sptId) {
                    SptPpn::where('spt_id', $sptId)->delete();
                    SptInduk::where('spt_id', $sptId)->delete();

                    $spt2126 = Spt2126::where('spt_id', $sptId)->first();
                    if ($spt2126) {
                        Spt2126Detail::where('spt2126_id', $spt2126->id)->delete();
                        $spt2126->delete();
                    }

                    $sptUnifikasi = SptUnifikasi::where('spt_id', $sptId)->first();
                    if ($sptUnifikasi) {
                        SptUnifikasiDetail::where('spt_unifikasi_id', $sptUnifikasi->id)->delete();
                        $sptUnifikasi->delete();
                    }

                    $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })->find($sptId);

                    if ($spt) {
                        $spt->status = 'created';
                        $spt->tax_value = 0;
                        $spt->ntte = null;

                        $spt->save();
                    }
                }
            });

            return redirect()->route('payment.billing')->with('success', 'Billing group berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Error saat menghapus billing group: ' . $e->getMessage());
            return redirect()->route('payment.billing')->with('error', $e->getMessage());
        }
    }


    private function createLedgerForBilling($billing, $user)
    {
        $billing->load('billingType');
        $descriptionParts = explode('-', $billing->billingType->code);
        $kap = $descriptionParts[0] ?? null;
        $kjs = $descriptionParts[1] ?? null;

        $lastLedger = Ledger::where('kap', $kap)
            ->where('kjs', $kjs)
            ->orderBy('transaction_number', 'desc')
            ->first();

        if ($lastLedger && preg_match('/(\d{3})$/', $lastLedger->transaction_number, $matches)) {
            $lastSequence = (int) $matches[1];
            $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $sequence = '001';
        }

        $currentDate = now()->format('dmY');
        $transactionNumber = $kap . $kjs . $currentDate . $sequence;

        $ledger = Ledger::create([
            'user_id' => $user->id,
            'billing_id' => $billing->id,
            'billing_type_id' => $billing->billing_type_id,
            'transaction_date' => now(),
            'posting_date' => now(),
            'accounting_type' => 'pembayaran',
            'accounting_type_detail' => 'pembayaran tunai',
            'currency' => $billing->currency,
            'transaction_type' => 'credit',
            'debit_amount' => 0,
            'debit_unpaid' => 0,
            'credit_amount' => $billing->amount,
            'credit_left' => ($billing->billingType->code === '411618-100') ? $billing->amount : 0,
            'kap' => $kap,
            'kap_description' => $billing->billingType->description,
            'kjs' => $kjs,
            'tax_period' => $billing->start_period . ' ' . $billing->year,
            'transaction_number' => $transactionNumber,
        ]);

        // Attach ledger & billing to course via course_results (avoid duplicates)
        $activeCourseId = session('active_course_id');
        if ($activeCourseId) {
            $courseUser = $this->ensureCourseUser($user->id, $activeCourseId);
            $this->attachLedgerToCourse($ledger, $billing, $courseUser);
        }
    }

    public function lihatPDF($billingFormId)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'Active course belum dipilih');
        }
        $user = Auth::user();

        // Ambil semua billing dengan billing_form_id yang sama (sudah terscope lewat course_results)
        $billings = Billing::with(['user', 'billingType'])
            ->byBillingForm($billingFormId)
            ->forUserAndCourseSmart($user->id, $activeCourseId)
            ->where('status', 'unpaid')
            ->get();

        if ($billings->isEmpty()) {
            abort(404, 'Billing tidak ditemukan');
        }

        $firstBilling = $billings->first();
        $totalAmount = $billings->sum('amount');

        // Data untuk PDF
        $pdfData = [
            'billings' => $billings,
            'user' => $user,
            'billing_form_id' => $billingFormId,
            'total_amount' => $totalAmount,
            'billing_count' => $billings->count(),
            'start_period' => $firstBilling->start_period,
            'year' => $firstBilling->year,
            'currency' => $firstBilling->currency,
            'active_period' => $firstBilling->active_period,
        ];

        $pdf = Pdf::loadView('pdf/billing', $pdfData);
        return $pdf->stream('billing_group_' . $billingFormId . '.pdf');
    }

    /**
     * Ensure a CourseUser record exists for user+course.
     */
    private function ensureCourseUser($userId, $courseId)
    {
        return CourseUser::firstOrCreate([
            'user_id' => $userId,
            'course_id' => $courseId,
        ]);
    }

    /**
     * Attach billing to course via course_results if not already.
     */
    private function attachBillingToCourse(Billing $billing, CourseUser $courseUser): void
    {
        $exists = CourseResult::where('billing_id', $billing->id)
            ->where('course_user_id', $courseUser->id)
            ->exists();
        if (!$exists) {
            CourseResult::create([
                'course_user_id' => $courseUser->id,
                'billing_id' => $billing->id,
                'ledger_id' => null,
                'spt_id' => $billing->spt_id,
            ]);
        }
    }

    /**
     * Attach ledger (and optionally billing) to course via course_results, reuse existing billing linkage when present.
     */
    private function attachLedgerToCourse(Ledger $ledger, Billing $billing, CourseUser $courseUser): void
    {
        // Cek apakah sudah ada relasi course_result khusus untuk ledger ini
        $existingForLedger = CourseResult::where('course_user_id', $courseUser->id)
            ->where('ledger_id', $ledger->id)
            ->first();

        if ($existingForLedger) {
            return; // sudah ter-link
        }

        // Coba pakai rekaman billing yang sudah ada untuk mengisi ledger_id jika kosong
        $billingLink = CourseResult::where('course_user_id', $courseUser->id)
            ->where('billing_id', $billing->id)
            ->whereNull('ledger_id')
            ->first();

        if ($billingLink) {
            $billingLink->ledger_id = $ledger->id;
            $billingLink->save();
            return;
        }

        // Jika sudah ada rekaman billing tetapi ledger_id sudah terisi (mis. baris ledger ke-2), buat baris baru
        CourseResult::create([
            'course_user_id' => $courseUser->id,
            'billing_id' => $billing->id,
            'ledger_id' => $ledger->id,
            'spt_id' => $billing->spt_id,
        ]);
    }
}
