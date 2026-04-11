<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\Ledger;
use App\Models\Spt;
use App\Models\SptUnifikasi;
use App\Models\SptUnifikasiDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;

class SPTUniController extends Controller
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
            return redirect()->route('spt.detailUni', ['id' => $sptId])->with('error', 'Password salah!');
        }

        try {
            // Ambil SPT ter-scope pada active course
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->find($request->input('spt_id'));

            if (!$spt) {
                return redirect()->route('spt.konsep')->with('error', 'SPT tidak ditemukan dalam kelas aktif.');
            }

            // Simpan data SPT Unifikasi
            $sptUnifikasi = SptUnifikasi::create([
                'spt_id' => $spt->id,
                'setor_1' => $request->input('setor_1', 0),
                'setor_1a' => $request->input('setor_1a', 0),
                'setor_1b' => $request->input('setor_1b', 0),
                'setor_1c' => $request->input('setor_1c', 0),
                'setor_2' => $request->input('setor_2', 0),
                'setor_2a' => $request->input('setor_2a', 0),
                'setor_2b' => $request->input('setor_2b', 0),
                'setor_3' => $request->input('setor_3', 0),
                'setor_3a' => $request->input('setor_3a', 0),
                'setor_3b' => $request->input('setor_3b', 0),
                'setor_3c' => $request->input('setor_3c', 0),
                'setor_4' => $request->input('setor_4', 0),
                'setor_4a' => $request->input('setor_4a', 0),
                'setor_5' => $request->input('setor_5', 0),
                'setor_5a' => $request->input('setor_5a', 0),
                'total_setor' => $request->input('total_setor', 0),
                'pemotongan_1' => $request->input('pemotongan_1', 0),
                'pemotongan_1a' => $request->input('pemotongan_1a', 0),
                'pemotongan_1b' => $request->input('pemotongan_1b', 0),
                'pemotongan_1c' => $request->input('pemotongan_1c', 0),
                'pemotongan_2' => $request->input('pemotongan_2', 0),
                'pemotongan_2a' => $request->input('pemotongan_2a', 0),
                'pemotongan_2b' => $request->input('pemotongan_2b', 0),
                'pemotongan_3' => $request->input('pemotongan_3', 0),
                'pemotongan_3a' => $request->input('pemotongan_3a', 0),
                'pemotongan_3b' => $request->input('pemotongan_3b', 0),
                'pemotongan_3c' => $request->input('pemotongan_3c', 0),
                'pemotongan_4' => $request->input('pemotongan_4', 0),
                'pemotongan_4a' => $request->input('pemotongan_4a', 0),
                'pemotongan_5' => $request->input('pemotongan_5', 0),
                'pemotongan_5a' => $request->input('pemotongan_5a', 0),
                'total_pemotongan' => $request->input('total_pemotongan', 0),
                'pphpemerintah_1' => $request->input('pphpemerintah_1', 0),
                'pphpemerintah_1a' => $request->input('pphpemerintah_1a', 0),
                'pphpemerintah_1b' => $request->input('pphpemerintah_1b', 0),
                'pphpemerintah_1c' => $request->input('pphpemerintah_1c', 0),
                'pphpemerintah_2' => $request->input('pphpemerintah_2', 0),
                'pphpemerintah_2a' => $request->input('pphpemerintah_2a', 0),
                'pphpemerintah_2b' => $request->input('pphpemerintah_2b', 0),
                'pphpemerintah_3' => $request->input('pphpemerintah_3', 0),
                'pphpemerintah_3a' => $request->input('pphpemerintah_3a', 0),
                'pphpemerintah_3b' => $request->input('pphpemerintah_3b', 0),
                'pphpemerintah_3c' => $request->input('pphpemerintah_3c', 0),
                'pphpemerintah_4' => $request->input('pphpemerintah_4', 0),
                'pphpemerintah_4a' => $request->input('pphpemerintah_4a', 0),
                'pphpemerintah_5' => $request->input('pphpemerintah_5', 0),
                'pphpemerintah_5a' => $request->input('pphpemerintah_5a', 0),
                'total_pphpemerintah' => $request->input('total_pphpemerintah', 0),
                'jumlahpph_1' => $request->input('jumlahpph_1', 0),
                'jumlahpph_1a' => $request->input('jumlahpph_1a', 0),
                'jumlahpph_1b' => $request->input('jumlahpph_1b', 0),
                'jumlahpph_1c' => $request->input('jumlahpph_1c', 0),
                'jumlahpph_2' => $request->input('jumlahpph_2', 0),
                'jumlahpph_2a' => $request->input('jumlahpph_2a', 0),
                'jumlahpph_2b' => $request->input('jumlahpph_2b', 0),
                'jumlahpph_3' => $request->input('jumlahpph_3', 0),
                'jumlahpph_3a' => $request->input('jumlahpph_3a', 0),
                'jumlahpph_3b' => $request->input('jumlahpph_3b', 0),
                'jumlahpph_3c' => $request->input('jumlahpph_3c', 0),
                'jumlahpph_4' => $request->input('jumlahpph_4', 0),
                'jumlahpph_4a' => $request->input('jumlahpph_4a', 0),
                'jumlahpph_5' => $request->input('jumlahpph_5', 0),
                'jumlahpph_5a' => $request->input('jumlahpph_5a', 0),
                'total_jumlahpph' => $request->input('total_jumlahpph', 0),
                'pphdibetulkan_1' => $request->input('pphdibetulkan_1', 0),
                'pphdibetulkan_1a' => $request->input('pphdibetulkan_1a', 0),
                'pphdibetulkan_1b' => $request->input('pphdibetulkan_1b', 0),
                'pphdibetulkan_1c' => $request->input('pphdibetulkan_1c', 0),
                'pphdibetulkan_2' => $request->input('pphdibetulkan_2', 0),
                'pphdibetulkan_2a' => $request->input('pphdibetulkan_2a', 0),
                'pphdibetulkan_2b' => $request->input('pphdibetulkan_2b', 0),
                'pphdibetulkan_3' => $request->input('pphdibetulkan_3', 0),
                'pphdibetulkan_3a' => $request->input('pphdibetulkan_3a', 0),
                'pphdibetulkan_3b' => $request->input('pphdibetulkan_3b', 0),
                'pphdibetulkan_3c' => $request->input('pphdibetulkan_3c', 0),
                'pphdibetulkan_4' => $request->input('pphdibetulkan_4', 0),
                'pphdibetulkan_4a' => $request->input('pphdibetulkan_4a', 0),
                'pphdibetulkan_5' => $request->input('pphdibetulkan_5', 0),
                'pphdibetulkan_5a' => $request->input('pphdibetulkan_5a', 0),
                'total_pphdibetulkan' => $request->input('total_pphdibetulkan', 0),
                'pphkurangbayar_1' => $request->input('pphkurangbayar_1', 0),
                'pphkurangbayar_1a' => $request->input('pphkurangbayar_1a', 0),
                'pphkurangbayar_1b' => $request->input('pphkurangbayar_1b', 0),
                'pphkurangbayar_1c' => $request->input('pphkurangbayar_1c', 0),
                'pphkurangbayar_2' => $request->input('pphkurangbayar_2', 0),
                'pphkurangbayar_2a' => $request->input('pphkurangbayar_2a', 0),
                'pphkurangbayar_2b' => $request->input('pphkurangbayar_2b', 0),
                'pphkurangbayar_3' => $request->input('pphkurangbayar_3', 0),
                'pphkurangbayar_3a' => $request->input('pphkurangbayar_3a', 0),
                'pphkurangbayar_3b' => $request->input('pphkurangbayar_3b', 0),
                'pphkurangbayar_3c' => $request->input('pphkurangbayar_3c', 0),
                'pphkurangbayar_4' => $request->input('pphkurangbayar_4', 0),
                'pphkurangbayar_4a' => $request->input('pphkurangbayar_4a', 0),
                'pphkurangbayar_5' => $request->input('pphkurangbayar_5', 0),
                'pphkurangbayar_5a' => $request->input('pphkurangbayar_5a', 0),
                'total_pphkurangbayar' => $request->input('total_pphkurangbayar', 0),
                'ttd_npwp' => $request->input('ttd_npwp'),
                'ttd_name' => $request->input('ttd_name'),
                'penandatangan' => $request->input('penandatangan'),
            ]);

            // Proses data dari tab
            $tabData = $request->input('tab_data', []);

            // Simpan data TabI (daftar BUPOT)
            foreach ($tabData as $data) {
                SptUnifikasiDetail::create([
                    'spt_unifikasi_id' => $sptUnifikasi->id,
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

            // Buat billing dan ledger untuk billing dan deposit method
            if ($paymentMethod === 'billing' || $paymentMethod === 'deposit') {
                $billingDataArr = $request->input('billing_data', []);
                $ledgerDataArr = $request->input('ledger_data', []);

                // Pastikan array
                if (!is_array($billingDataArr)) $billingDataArr = [$billingDataArr];
                if (!is_array($ledgerDataArr)) $ledgerDataArr = [$ledgerDataArr];

                $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
                $billingFormId = $lastBillingFormId + 1;
                // $spt sudah di-scope di atas
                $correction_type = $spt->correction_number == 1 ? 'spt pembetulan' : 'spt normal';

                // Ambil data bupot dari tab_data
                $tabData = $request->input('tab_data', []);

                // Buat billing per bupot
                foreach ($tabData as $index => $bupotData) {
                    // Cari billing_data yang sesuai dengan bupot ini
                    $billingData = $billingDataArr[$index] ?? $billingDataArr[0] ?? [];
                    $billingTypeId = $this->getBillingTypeIdFromBupot($bupotData);

                    // Buat billing untuk setiap bupot
                    $billing = new Billing([
                        'user_id' => $user->id,
                        'spt_id' => $sptUnifikasi->spt_id,
                        'billing_type_id' => $billingTypeId,
                        'billing_form_id' => $billingFormId,
                        'start_period' => $billingData['start_period'] ?? null,
                        'end_period' => $billingData['start_period'] ?? null,
                        'year' => $billingData['year'] ?? null,
                        'currency' => $billingData['currency'] ?? null,
                        'amount' => $bupotData['tax'] ?? 0,
                        'amount_in_words' => $billingData['amount_in_words'] ?? null,
                        'description' => "SPT Masa PPh Unifikasi periode {$billingData['start_period']} {$billingData['year']} - {$bupotData['name']}",
                        'status' => $paymentMethod === 'deposit' ? 'paid' : 'unpaid', // <- BERBEDA: deposit = paid
                        'active_period' => $billingData['active_period'] ?? null,
                        'code' => $billingData['code'] ?? null,
                    ]);
                    $billing->save();

                    // Link billing ke kelas aktif via course_results
                    $courseUser = \App\Models\CourseUser::firstOrCreate([
                        'user_id' => $user->id,
                        'course_id' => $activeCourseId,
                    ]);
                    $billingLinked = \App\Models\CourseResult::where('course_user_id', $courseUser->id)
                        ->where('billing_id', $billing->id)
                        ->first();
                    if (!$billingLinked) {
                        \App\Models\CourseResult::create([
                            'course_user_id' => $courseUser->id,
                            'billing_id' => $billing->id,
                            'spt_id' => $sptUnifikasi->spt_id,
                        ]);
                    }

                    // Ambil kap_description konsisten dari master_billing_types
                    $kapDescription = '';
                    if ($billingTypeId) {
                        $billingType = \App\Models\MasterBillingType::find($billingTypeId);
                        if ($billingType) {
                            $kapDescription = $billingType->description;
                        }
                    }

                    $ledgerData = $ledgerDataArr[$index] ?? $ledgerDataArr[0] ?? [];

                    // Fallback ke frontend data jika tidak ada di database
                    if (!$kapDescription) {
                        $kapDescription = $ledgerData['kap_description'] ?? '';
                    }

                    if ($paymentMethod === 'billing') {
                        // Untuk billing method: 1 ledger per bupot dengan debit NEGATIF (tidak mempengaruhi saldo)
                        $billingAmount = $bupotData['tax'] ?? 0;

                        $ledger = new Ledger([
                            'user_id' => $user->id,
                            'billing_id' => $billing->id,
                            'billing_type_id' => $billingTypeId,
                            'transaction_date' => $ledgerData['transaction_date'] ?? null,
                            'posting_date' => $ledgerData['posting_date'] ?? null,
                            'accounting_type' => $ledgerData['accounting_type'] ?? null,
                            'accounting_type_detail' => $correction_type,
                            'currency' => $ledgerData['currency'] ?? null,
                            'transaction_type' => $ledgerData['transaction_type'] ?? null,
                            'debit_amount' => -$billingAmount, // NEGATIF - tidak mempengaruhi saldo
                            'debit_unpaid' => 0, // TIDAK menambah tunggakan
                            'credit_amount' => 0, // TIDAK menambah credit
                            'credit_left' => 0,
                            'kap' => $ledgerData['kap'] ?? null,
                            'kap_description' => $kapDescription,
                            'kjs' => $ledgerData['kjs'] ?? null,
                            'tax_period' => $ledgerData['tax_period'] ?? null,
                            'transaction_number' => $ledgerData['transaction_number'] ?? null,
                        ]);
                        $ledger->save();

                        // Link ledger ke kelas aktif
                        $exists = \App\Models\CourseResult::where('course_user_id', $courseUser->id)
                            ->where('ledger_id', $ledger->id)
                            ->exists();
                        if (!$exists) {
                            \App\Models\CourseResult::create([
                                'course_user_id' => $courseUser->id,
                                'billing_id' => $billing->id,
                                'ledger_id' => $ledger->id,
                                'spt_id' => $sptUnifikasi->spt_id,
                            ]);
                        }
                    } else if ($paymentMethod === 'deposit') {
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
                                'billing_type_id' => $billingTypeId,
                                'transaction_date' => $ledgerData['transaction_date'] ?? null,
                                'posting_date' => $ledgerData['posting_date'] ?? null,
                                'accounting_type' => $entry['accounting_type'],
                                'accounting_type_detail' => $entry['accounting_type_detail'],
                                'currency' => $ledgerData['currency'] ?? null,
                                'transaction_type' => $entry['transaction_type'],
                                'debit_amount' => ($entry['accounting_type'] === 'surat pemberitahuan' || $entry['accounting_type'] === 'pengembalian' || $entry['accounting_type'] === 'penyesuaian')
                                    ? ($ledgerData['debit_amount'] ?? ($bupotData['tax'] ?? 0) * -1)
                                    : 0,
                                'debit_unpaid' => $ledgerData['debit_unpaid'] ?? 0,
                                'credit_amount' => $entry['accounting_type'] === 'pembayaran'
                                    ? abs($ledgerData['debit_amount'] ?? ($bupotData['tax'] ?? 0))
                                    : 0,
                                'credit_left' => $ledgerData['credit_left'] ?? 0,
                                'kap' => $ledgerData['kap'] ?? null,
                                'kap_description' => $kapDescription,
                                'kjs' => $ledgerData['kjs'] ?? null,
                                'tax_period' => $ledgerData['tax_period'] ?? null,
                                'transaction_number' => ($ledgerData['transaction_number'] ?? '') . '-' . ($index + 1),
                            ]);
                            $ledger->save();

                            // Link setiap ledger ke kelas aktif (satu row per ledger)
                            $exists = \App\Models\CourseResult::where('course_user_id', $courseUser->id)
                                ->where('ledger_id', $ledger->id)
                                ->exists();
                            if (!$exists) {
                                \App\Models\CourseResult::create([
                                    'course_user_id' => $courseUser->id,
                                    'billing_id' => $billing->id,
                                    'ledger_id' => $ledger->id,
                                    'spt_id' => $sptUnifikasi->spt_id,
                                ]);
                            }
                        }
                    }
                }
            }

            // Perbarui status SPT
            // $spt sudah di-scope di atas

            // Update status SPT berdasarkan metode pembayaran
            if ($paymentMethod === 'deposit' || $paymentMethod === 'spt') {
                $spt->status = 'approved';
                $spt->payment_value = $request->input('total_jumlahpph', 0);
                $spt->paid_date = now();
            } else {
                $spt->status = 'waiting';
            }

            $spt->tax_value = $request->input('total_jumlahpph', 0);

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
            return redirect()->route('spt.konsep')->with('error', $e->getMessage());
        }
    }

    private function getBillingTypeIdFromBupot($bupotData)
    {
        $taxName = $bupotData['tax_name'] ?? null;

        // Mapping berdasarkan tax_name
        if ($taxName) {
            $billingType = \App\Models\MasterBillingType::where('description', 'LIKE', '%' . $taxName . '%')
                ->orWhere('description', 'LIKE', '%' . strtolower($taxName) . '%')
                ->first();

            if ($billingType) {
                return $billingType->id;
            }
        }

        return null; // Tidak ditemukan
    }
}
