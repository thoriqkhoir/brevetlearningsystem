<?php


namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\Ledger;
use App\Models\Spt;
use App\Models\Spt2126;
use App\Models\Spt2126Detail;
use App\Models\CourseUser;
use App\Models\CourseResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;

class SPT2126Controller extends Controller
{
    public function store(Request $request)
    {
        // Validasi request
        $request->validate([
            'spt_id' => 'required|uuid|exists:spt,id',
            'payment_method' => 'required|string|in:billing,deposit,spt',
            'password' => 'required|string',
        ]);

        $password = $request->input('password');
        $user = Auth::user();

        // Active course scoping
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        // Validasi password
        if (!Hash::check($password, $user->password)) {
            $sptId = $request->input('spt_id');
            return redirect()->route('spt.detail21', ['id' => $sptId])->with('error', 'Password salah!');
        }

        try {
            // Ambil SPT ter-scope pada active course
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->find($request->input('spt_id'));

            if (!$spt) {
                return redirect()->route('spt.konsep')->with('error', 'SPT tidak ditemukan dalam kelas aktif.');
            }

            // Simpan data SPT 21/26
            $spt2126 = Spt2126::create([
                'spt_id' => $spt->id,
                // PPh 21 fields
                'ppha1' => $request->input('ppha1', 0),
                'ppha2' => $request->input('ppha2', 0),
                'ppha3' => $request->input('ppha3', 0),
                'ppha4' => $request->input('ppha4', 0),
                'ppha5' => $request->input('ppha5', 0),
                'ppha6' => $request->input('ppha6', 0),
                'pphapemerintah' => $request->input('pphapemerintah', 0),
                // PPh 26 fields
                'pphb1' => $request->input('pphb1', 0),
                'pphb2' => $request->input('pphb2', 0),
                'pphb3' => $request->input('pphb3', 0),
                'pphb4' => $request->input('pphb4', 0),
                'pphb5' => $request->input('pphb5', 0),
                'pphb6' => $request->input('pphb6', 0),
                'pphbpemerintah' => $request->input('pphbpemerintah', 0),
                // Signature information
                'penandatangan' => $request->input('penandatangan'),
                'ttd_name' => $request->input('ttd_name'),
            ]);

            // Proses data dari tab
            $tabData = $request->input('tab_data', []);
            
            // Simpan data detail dari semua tab
            foreach ($tabData as $data) {
                Spt2126Detail::create([
                    'spt2126_id' => $spt2126->id,
                    'tab_type' => $data['tab_type'] ?? null,
                    'npwp' => $data['npwp'] ?? null,
                    'name' => $data['name'] ?? null,
                    'doc_no' => $data['doc_no'] ?? null,
                    'doc_date' => $data['doc_date'] ?? null,
                    'tax_type' => $data['tax_type'] ?? null,
                    'tax_code' => $data['tax_code'] ?? null,
                    'tax_name' => $data['tax_name'] ?? null,
                    'dpp' => $data['dpp'] ?? 0,
                    'tarif' => $data['tarif'] ?? 0,
                    'tax' => $data['tax'] ?? 0,
                    'facility' => $data['facility'] ?? null,
                    'description' => $data['description'] ?? null,
                ]);
            }

            $paymentMethod = $request->input('payment_method');
            
            // Hitung total pajak terutang (ppha1 + pphb1)
            $totalTax = ($request->input('ppha1', 0) + $request->input('pphb1', 0));

            // Buat billing untuk semua metode pembayaran (billing dan deposit)
            if ($paymentMethod === 'billing' || $paymentMethod === 'deposit') {
                // Generate billing_form_id yang unik
                $lastBilling = Billing::orderBy('billing_form_id', 'desc')->first();
                $nextBillingFormId = $lastBilling ? $lastBilling->billing_form_id + 1 : 1;

                $billingData = $request->input('billing_data');
                $billing = new Billing([
                    'user_id' => $user->id,
                    'spt_id' => $spt2126->spt_id,
                    'billing_form_id' => $nextBillingFormId, // Tambahkan billing_form_id yang unik
                    'billing_type_id' => $billingData['billing_type_id'],
                    'start_period' => $billingData['start_period'],
                    'end_period' => $billingData['start_period'], // Untuk SPT 21/26, periode awal dan akhir sama
                    'year' => $billingData['year'],
                    'currency' => $billingData['currency'],
                    'amount' => $totalTax, // Gunakan total pajak (PPh 21 + PPh 26)
                    'amount_in_words' => $billingData['amount_in_words'],
                    'description' => $billingData['description'],
                    'status' => $paymentMethod === 'deposit' ? 'paid' : 'unpaid', // deposit = paid, billing = unpaid
                    'active_period' => $billingData['active_period'],
                    'code' => $billingData['code'],
                ]);
                $billing->save();

                // Link billing ke kelas aktif via course_results
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
                        'spt_id' => $spt2126->spt_id,
                    ]);
                }

                if ($paymentMethod === 'billing') {
                    // Untuk billing method: buat 1 ledger entry dengan debit NEGATIF (tidak mempengaruhi saldo)
                    $ledgerData = $request->input('ledger_data');
                    // $spt sudah di-scope di atas
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
                        'debit_amount' => -$totalTax, // NEGATIF - tidak mempengaruhi saldo
                        'debit_unpaid' => 0, // TIDAK menambah tunggakan
                        'credit_amount' => 0, // TIDAK menambah credit
                        'credit_left' => 0,
                        'kap' => $ledgerData['kap'],
                        'kap_description' => 'PPh Pasal 21/26',
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
                            'spt_id' => $spt2126->spt_id,
                        ]);
                    }
                } else if ($paymentMethod === 'deposit') {
                    $ledgerData = $request->input('ledger_data');
                    // $spt sudah di-scope di atas
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
                            'billing_id' => $billing->id, // Tambahkan billing_id
                            'billing_type_id' => $ledgerData['billing_type_id'],
                            'transaction_date' => $ledgerData['transaction_date'],
                            'posting_date' => $ledgerData['posting_date'],
                            'accounting_type' => $entry['accounting_type'],
                            'accounting_type_detail' => $entry['accounting_type_detail'],
                            'currency' => $ledgerData['currency'],
                            'transaction_type' => $entry['transaction_type'],
                            'debit_amount' => ($entry['accounting_type'] === 'surat pemberitahuan' || $entry['accounting_type'] === 'pengembalian' || $entry['accounting_type'] === 'penyesuaian')
                                ? -$totalTax
                                : 0,
                            'debit_unpaid' => $ledgerData['debit_unpaid'],
                            'credit_amount' => $entry['accounting_type'] === 'pembayaran' ? $totalTax : 0,
                            'credit_left' => $ledgerData['credit_left'],
                            'kap' => $ledgerData['kap'],
                            'kap_description' => 'PPh Pasal 21/26',
                            'kjs' => $ledgerData['kjs'],
                            'tax_period' => $ledgerData['tax_period'],
                            'transaction_number' => $ledgerData['transaction_number'],
                        ]);
                        $ledger->save();

                        // Link tiap ledger deposit ke kelas aktif (SATU row per ledger)
                        $exists = CourseResult::where('course_user_id', $courseUser->id)
                            ->where('ledger_id', $ledger->id)
                            ->exists();
                        if (!$exists) {
                            CourseResult::create([
                                'course_user_id' => $courseUser->id,
                                'billing_id' => $billing->id,
                                'ledger_id' => $ledger->id,
                                'spt_id' => $spt2126->spt_id,
                            ]);
                        }
                    }
                }
            }

            // Perbarui status SPT
            // $spt sudah di-scope di atas

            // Update status SPT berdasarkan metode pembayaran
            if ($paymentMethod === 'deposit' || $paymentMethod === 'spt') {
                $spt->status = 'approved';
                $spt->payment_value = $totalTax;
                $spt->paid_date = now();
            } else {
                $spt->status = 'waiting';
            }

            $spt->tax_value = $totalTax;
            
            // Buat nomor NTTE
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

            // Redirect berdasarkan metode pembayaran
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
            return redirect()->route('spt.konsep')->with('error', 'Error: ' . $e->getMessage());
        }
    }
}