<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSPTIndukRequest;
use App\Models\Billing;
use App\Models\Ledger;
use App\Models\CourseUser;
use App\Models\CourseResult;
use App\Models\Spt;
use App\Models\SptInduk;
use App\Models\SptPpn;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;

class SPTIndukController extends Controller
{
    public function storeInduk(StoreSPTIndukRequest $request)
    {
        $validated = $request->validated();

        $password = $request->input('password');
        $user = Auth::user();

        // Active course scoping
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        if (!Hash::check($password, $user->password)) {
            $sptId = $request->input('spt_id');
            return redirect()->route('spt.show', ['id' => $sptId])->with('error', 'Password salah!');
        }

        try {
            // Pastikan SPT terkait berada dalam active course
            $scopedSpt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->find($validated['spt_id']);

            if (!$scopedSpt) {
                return redirect()->route('spt.konsep')->with('error', 'SPT tidak ditemukan dalam kelas aktif.');
            }

            $sptInduk = SptInduk::create($validated);

            $tabData = $request->input('tab_data', []);

            foreach ($tabData as $data) {
                SptPpn::create([
                    'spt_id' => $sptInduk->spt_id,
                    'type' => $data['type'] ?? null,
                    'no' => $data['no'] ?? null,
                    'date' => $data['date'] ?? null,
                    'customer_id' => $data['customer_id'] ?? null,
                    'customer_name' => $data['customer_name'] ?? null,
                    'customer_email' => $data['customer_email'] ?? "customer@biinspira.co.id",
                    'customer_address' => $data['customer_address'] ?? null,
                    'dpp' => $data['dpp'] ?? 0,
                    'dpp_lain' => $data['dpp_lain'] ?? 0,
                    'ppn' => $data['ppn'] ?? 0,
                    'ppnbm' => $data['ppnbm'] ?? 0,
                    'retur_no' => $data['retur_no'] ?? null,
                ]);
            }

            $paymentMethod = $request->input('payment_method');
            $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
            $billingFormId = $lastBillingFormId + 1;

            // Buat billing untuk semua metode pembayaran (billing dan deposit)
            if ($paymentMethod === 'billing' || $paymentMethod === 'deposit') {
                $billingData = $request->input('billing_data');
                $billing = new Billing([
                    'user_id' => $user->id,
                    'spt_id' => $sptInduk->spt_id,
                    'billing_type_id' => $billingData['billing_type_id'],
                    'billing_form_id' => $billingFormId,
                    'start_period' => $billingData['start_period'],
                    'end_period' => $billingData['end_period'],
                    'year' => $billingData['year'],
                    'currency' => $billingData['currency'],
                    'amount' => $billingData['amount'],
                    'amount_in_words' => $billingData['amount_in_words'],
                    'description' => $billingData['description'],
                    'status' => $paymentMethod === 'deposit' ? 'paid' : 'unpaid', // deposit = paid, billing = unpaid
                    'active_period' => $billingData['active_period'],
                    'code' => $billingData['code'],
                ]);
                $billing->save();

                // Pastikan billing terhubung ke kelas aktif via course_results
                $courseUser = CourseUser::firstOrCreate([
                    'user_id' => $user->id,
                    'course_id' => $activeCourseId,
                ]);
                $billingLinked = CourseResult::where('course_user_id', $courseUser->id)
                    ->where('billing_id', $billing->id)
                    ->first();
                if (!$billingLinked) {
                    CourseResult::create([
                        'course_user_id' => $courseUser->id,
                        'billing_id' => $billing->id,
                        'spt_id' => $sptInduk->spt_id,
                    ]);
                }

                if ($paymentMethod === 'billing') {
                    // Untuk billing method: buat 1 ledger entry dengan debit NEGATIF (tidak mempengaruhi saldo)
                    $ledgerData = $request->input('ledger_data');
                    $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })->find($sptInduk->spt_id);
                    $correction_type = $spt->correction_number == 1 ? 'spt pembetulan' : 'spt normal';

                    $ledger = new Ledger([
                        'user_id' => $user->id,
                        'billing_id' => $billing->id,
                        'billing_type_id' => $ledgerData['billing_type_id'],
                        'transaction_date' => $ledgerData['transaction_date'],
                        'posting_date' => $ledgerData['posting_date'],
                        'accounting_type' => $ledgerData['accounting_type'],
                        'accounting_type_detail' => $correction_type,
                        'currency' => $ledgerData['currency'],
                        'transaction_type' => $ledgerData['transaction_type'],
                        'debit_amount' => -$billingData['amount'], // NEGATIF - tidak mempengaruhi saldo
                        'debit_unpaid' => 0, // TIDAK menambah tunggakan
                        'credit_amount' => 0, // TIDAK menambah credit
                        'credit_left' => 0,
                        'kap' => $ledgerData['kap'],
                        'kap_description' => $ledgerData['kap_description'],
                        'kjs' => $ledgerData['kjs'],
                        'tax_period' => $ledgerData['tax_period'],
                        'transaction_number' => $ledgerData['transaction_number'],
                    ]);
                    $ledger->save();

                    // Link ledger ke kelas aktif
                    $exists = CourseResult::where('course_user_id', $courseUser->id)
                        ->where('ledger_id', $ledger->id)
                        ->exists();
                    if (!$exists) {
                        CourseResult::create([
                            'course_user_id' => $courseUser->id,
                            'billing_id' => $billing->id,
                            'ledger_id' => $ledger->id,
                            'spt_id' => $sptInduk->spt_id,
                        ]);
                    }
                } else if ($paymentMethod === 'deposit') {
                    $ledgerData = $request->input('ledger_data');
                    $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                        $q->where('course_id', $activeCourseId);
                    })->find($sptInduk->spt_id);
                    $correction_type = $spt->correction_number == 1 ? 'spt pembetulan' : 'spt normal';

                    $ledgerEntries = [
                        [
                            'accounting_type' => 'pembayaran',
                            'transaction_type' => 'credit',
                            'accounting_type_detail' => 'pemindahbukuan',
                        ],
                        [
                            'accounting_type' => 'penyesuaian',
                            'transaction_type' => 'debit',
                            'accounting_type_detail' => 'pemindahbukuan',
                        ],
                        [
                            'accounting_type' => 'surat pemberitahuan',
                            'transaction_type' => 'debit',
                            'accounting_type_detail' => $correction_type,
                        ],
                    ];

                    foreach ($ledgerEntries as $entry) {
                        $ledger = new Ledger([
                            'user_id' => $user->id,
                            'billing_id' => $billing->id, 
                            'billing_type_id' => $ledgerData['billing_type_id'],
                            'transaction_date' => $ledgerData['transaction_date'],
                            'posting_date' => $ledgerData['posting_date'],
                            'accounting_type' => $entry['accounting_type'],
                            'accounting_type_detail' => $entry['accounting_type_detail'],
                            'currency' => $ledgerData['currency'],
                            'transaction_type' => $entry['transaction_type'],
                            'debit_amount' => ($entry['accounting_type'] === 'surat pemberitahuan' || $entry['accounting_type'] === 'pengembalian' || $entry['accounting_type'] === 'penyesuaian')
                                ? $ledgerData['debit_amount']
                                : 0,
                            'debit_unpaid' => $ledgerData['debit_unpaid'],
                            'credit_amount' => $entry['accounting_type'] === 'pembayaran' ? abs($ledgerData['debit_amount']) : 0,
                            'credit_left' => $ledgerData['credit_left'],
                            'kap' => $ledgerData['kap'],
                            'kap_description' => $ledgerData['kap_description'],
                            'kjs' => $ledgerData['kjs'],
                            'tax_period' => $ledgerData['tax_period'],
                            'transaction_number' => $ledgerData['transaction_number'],
                        ]);
                        $ledger->save();

                        // Link setiap ledger ke kelas aktif via course_results (SATU ROW per ledger)
                        $exists = CourseResult::where('course_user_id', $courseUser->id)
                            ->where('ledger_id', $ledger->id)
                            ->exists();
                        if (!$exists) {
                            CourseResult::create([
                                'course_user_id' => $courseUser->id,
                                'billing_id' => $billing->id,
                                'ledger_id' => $ledger->id,
                                'spt_id' => $sptInduk->spt_id,
                            ]);
                        }
                    }
                }
            }

            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->find($sptInduk->spt_id);

            if ($paymentMethod === 'deposit' || $paymentMethod === 'spt') {
                $spt->status = 'approved';
                $spt->payment_value = ($sptInduk->ppn_ce ?? 0) + ($sptInduk->ppn_kms ?? 0) + ($sptInduk->ppn_pkpm ?? 0) + ($sptInduk->ppnbm_dc ?? 0);
                $spt->paid_date = now();
            } else {
                $spt->status = 'waiting';
            }

            $spt->tax_value = ($sptInduk->ppn_ce ?? 0) + ($sptInduk->ppn_kms ?? 0) + ($sptInduk->ppn_pkpm ?? 0) + ($sptInduk->ppnbm_dc ?? 0);
            $year = $spt->year;
            $sptCount = Spt::whereYear('created_at', $year)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->whereNotNull('ntte')
                ->count();
            $sequence = str_pad($sptCount + 1, 5, '0', STR_PAD_LEFT);
            $spt->ntte = "BPE-{$sequence}/CT/KPP/{$year}";
            $spt->save();

            if ($paymentMethod === 'deposit') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melakukan Pembayaran dengan Saldo Deposit.');
            } elseif ($paymentMethod === 'billing') {
                return redirect()->route('payment.billing')->with('success', 'Berhasil Membuat Kode Billing.');
            } elseif ($paymentMethod === 'spt') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melaporkan SPT.');
            } else {
                return redirect()->route('spt.konsep')->with('error', 'Pembayaran dibatalkan.');
            }
        } catch (\Exception $e) {
            return redirect()->route('spt.konsep')->with('error', $e->getMessage());
        }
    }
}
