<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Billing;
use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Ledger;
use App\Models\MasterAccount;
use App\Models\MasterObject;
use App\Models\MasterTku;
use App\Models\Spt;
use App\Models\SptOp;
use App\Models\SptOpL1A1;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use App\Models\SptOpL1A2;
use App\Models\SptOpL1A3;
use App\Models\SptOpL1A4;
use App\Models\SptOpL1A5;
use App\Models\SptOpL1A6;
use App\Models\SptOpL1A7;
use App\Models\SptOpL1B;
use App\Models\SptOpL1C;
use App\Models\SptOpL1D;
use App\Models\SptOpL1E;
use App\Models\SptOpL2A;
use App\Models\SptOpL2B;
use App\Models\SptOpL2C;
use App\Models\SptOpL3A13A1;
use App\Models\SptOpL3A13A2;
use App\Models\SptOpL3A4A;
use App\Models\SptOpL3A4B;
use App\Models\SptOpL3B;
use App\Models\SptOpL3C;
use App\Models\SptOpL3DA;
use App\Models\SptOpL3DB;
use App\Models\SptOpL3DC;
use App\Models\SptOpL4A;
use App\Models\SptOpL5A;
use App\Models\SptOpL5BC;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SptOpController extends Controller
{
    private const SOURCE_INCOME_ALLOWED = [
        'kegiatan usaha',
        'pekerjaan',
        'pekerjaan bebas',
        'lainnya',
    ];

    /**
     * Show the detail page for SPT OP
     */
    public function show($id)
    {
        if (session('active_business_entity_id')) {
            return redirect()->route('spt.konsep')->with('error', 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.');
        }

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        $spt = Spt::with(['form', 'user'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHOP');
            })
            ->findOrFail($id);

        $user = Auth::user();

        // Get or create SptOp record (needed so each tab can persist using spt_op_id)
        $sptOp = SptOp::firstOrCreate([
            'spt_id' => $spt->id,
        ]);

        // Get master data
        $masterAccounts = MasterAccount::all();
        $masterTku = MasterTku::all();
        $masterObjects = MasterObject::all();

        // Get ledger data for saldo calculation
        $ledgers = Ledger::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->get();

        $totalCredit = $ledgers->sum('credit_amount');
        $totalDebit = $ledgers->sum('debit_amount');
        $totalDebitUnpaid = $ledgers->sum('debit_unpaid');
        $totalCreditLeft = $totalDebit + $totalCredit;
        $saldo = $totalCreditLeft - $totalDebitUnpaid;

        // Transaction number generation
        $kap = "411125"; // KAP for PPh OP
        $kjs = "100";
        $lastLedger = Ledger::where('kap', $kap)
            ->where('kjs', $kjs)
            ->orderBy('transaction_number', 'desc')
            ->first();
        if ($lastLedger && preg_match('/(\d{3})$/', $lastLedger->transaction_number, $matches)) {
            $lastSequence = (int)$matches[1];
            $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $sequence = '001';
        }
        $currentDate = now()->format('dmY');
        $transactionNumber = $kap . $kjs . $currentDate . $sequence;

        // Load lampiran data if sptOp exists
        $lampiranData = null;
        if ($sptOp) {
            $lampiranData = [
                'l1a1' => SptOpL1A1::where('spt_op_id', $sptOp->id)->get(),
                'l1a2' => SptOpL1A2::where('spt_op_id', $sptOp->id)->get(),
                'l1a3' => SptOpL1A3::where('spt_op_id', $sptOp->id)->get(),
                'l1a4' => SptOpL1A4::where('spt_op_id', $sptOp->id)->get(),
                'l1a5' => SptOpL1A5::where('spt_op_id', $sptOp->id)->get(),
                'l1a6' => SptOpL1A6::where('spt_op_id', $sptOp->id)->get(),
                'l1a7' => SptOpL1A7::where('spt_op_id', $sptOp->id)->get(),
                'l1b' => SptOpL1B::where('spt_op_id', $sptOp->id)->get(),
                'l1c' => SptOpL1C::where('spt_op_id', $sptOp->id)->get(),
                'l1d' => SptOpL1D::where('spt_op_id', $sptOp->id)->get(),
                'l1e' => SptOpL1E::where('spt_op_id', $sptOp->id)->get(),
                'l2a' => SptOpL2A::where('spt_op_id', $sptOp->id)->get(),
                'l2b' => SptOpL2B::where('spt_op_id', $sptOp->id)->get(),
                'l2c' => SptOpL2C::where('spt_op_id', $sptOp->id)->get(),
                'l3a13a1' => SptOpL3A13A1::where('spt_op_id', $sptOp->id)->get(),
                'l3a13a2' => SptOpL3A13A2::where('spt_op_id', $sptOp->id)->get(),
                'l3a4a' => SptOpL3A4A::where('spt_op_id', $sptOp->id)->get(),
                'l3a4b' => SptOpL3A4B::where('spt_op_id', $sptOp->id)->get(),
                'l3b' => SptOpL3B::where('spt_op_id', $sptOp->id)->get(),
                'l3c' => SptOpL3C::where('spt_op_id', $sptOp->id)->get(),
                'l3da' => SptOpL3DA::where('spt_op_id', $sptOp->id)->get(),
                'l3db' => SptOpL3DB::where('spt_op_id', $sptOp->id)->get(),
                'l3dc' => SptOpL3DC::where('spt_op_id', $sptOp->id)->get(),
                'l4a' => SptOpL4A::where('spt_op_id', $sptOp->id)->first(),
                'l5a' => SptOpL5A::where('spt_op_id', $sptOp->id)->get(),
                'l5bc' => SptOpL5BC::where('spt_op_id', $sptOp->id)->get(),
            ];
        }

        // Get user's banks
        $banks = Bank::where('user_id', $user->id)
            ->orderBy('is_primary', 'desc')
            ->orderBy('bank_name')
            ->get();

        return Inertia::render('SPT/DetailSPTOP', [
            'spt' => $spt,
            'sptOp' => $sptOp,
            'lampiranData' => $lampiranData,
            'masterAccounts' => $masterAccounts,
            'masterTku' => $masterTku,
            'masterObjects' => $masterObjects,
            'saldo' => $saldo,
            'transactionNumber' => $transactionNumber,
            'banks' => $banks,
            'no_active_course' => false,
        ]);
    }

    /**
     * Store or update SPT OP data
     */
    public function store(Request $request)
    {
        if (session('active_business_entity_id')) {
            return redirect()->route('spt.konsep')->with('error', 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.');
        }

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        $user = Auth::user();

        // Validate password
        $password = $request->input('password');
        if (!Hash::check($password, $user->password)) {
            $sptId = $request->input('spt_id');
            return redirect()->route('spt.detailOp', ['id' => $sptId])->with('error', 'Password salah!');
        }

        try {
            $sptId = $request->input('spt_id');

            // Verify SPT belongs to active course
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
                ->whereHas('form', function ($q) {
                    $q->where('code', 'PPHOP');
                })
                ->findOrFail($sptId);

            // Create or update SptOp
            $sptOpData = $this->extractSptOpData($request);
            $sptOpData['spt_id'] = $sptId;

            $sptOp = SptOp::updateOrCreate(
                ['spt_id' => $sptId],
                $sptOpData
            );



            // Handle lampiran data
            $this->saveLampiranData($request, $sptOp->id);

            // Handle payment method
            $paymentMethod = $request->input('payment_method');
            // Ambil tax_value dari e_11_c (PPh yang masih harus dibayar)
            $taxValue = (int) ($sptOp->e_11_c ?? 0);

            if ($paymentMethod === 'billing' || $paymentMethod === 'deposit') {
                $this->handlePayment($request, $user, $spt, $sptOp, $activeCourseId, $paymentMethod, $taxValue);
            }

            // Update SPT status
            if ($paymentMethod === 'deposit' || $paymentMethod === 'spt') {
                $spt->status = 'approved';
                $spt->payment_value = $taxValue;
                $spt->paid_date = now();
            } else if ($paymentMethod === 'billing') {
                $spt->status = 'waiting';
            }

            $spt->tax_value = $taxValue;

            // Generate NTTE
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

            // Redirect based on payment method
            if ($paymentMethod === 'deposit') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melakukan Pembayaran dengan Saldo Deposit.');
            } elseif ($paymentMethod === 'billing') {
                return redirect()->route('payment.billing')->with('success', 'Berhasil Membuat Kode Billing.');
            } elseif ($paymentMethod === 'spt') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melaporkan SPT.');
            }

            return redirect()->route('spt.detailOp', ['id' => $sptId])->with('success', 'Data SPT OP berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    private function extractSptOpData(Request $request): array
    {
        $payload = $request->input('spt_op_data');
        if (!is_array($payload)) {
            $payload = $request->all();
        }

        $columns = Schema::getColumnListing('spt_op');
        $data = array_intersect_key($payload, array_flip($columns));
        unset($data['id'], $data['created_at'], $data['updated_at']);

        return $this->normalizeSourceIncome($data);
    }

    private function normalizeSourceIncome(array $data): array
    {
        $allowed = self::SOURCE_INCOME_ALLOWED;

        $sourceIncome = $data['source_income'] ?? null;
        $sourceIncomes = $data['source_incomes'] ?? null;

        if (is_array($sourceIncome)) {
            $normalized = array_values(array_filter($sourceIncome, fn($v) => is_string($v) && $v !== ''));
            $normalized = array_values(array_intersect($normalized, $allowed));
            if (empty($normalized)) {
                $normalized = ['lainnya'];
            }

            $data['source_income'] = $normalized[0];
            if (Schema::hasColumn('spt_op', 'source_incomes')) {
                $data['source_incomes'] = $normalized;
            }

            return $data;
        }

        if (is_array($sourceIncomes)) {
            $normalized = array_values(array_filter($sourceIncomes, fn($v) => is_string($v) && $v !== ''));
            $normalized = array_values(array_intersect($normalized, $allowed));
            if (!empty($normalized)) {
                $data['source_income'] = $normalized[0];
                if (Schema::hasColumn('spt_op', 'source_incomes')) {
                    $data['source_incomes'] = $normalized;
                }
            }

            return $data;
        }

        if (is_string($sourceIncome) && $sourceIncome !== '') {
            if (!in_array($sourceIncome, $allowed, true)) {
                $sourceIncome = 'lainnya';
                $data['source_income'] = $sourceIncome;
            }
            if (Schema::hasColumn('spt_op', 'source_incomes')) {
                $data['source_incomes'] = [$sourceIncome];
            }
        }

        return $data;
    }

    /**
     * Save lampiran data for SPT OP
     */
    private function saveLampiranData(Request $request, $sptOpId)
    {
        // Lampiran 1A1 - Kas dan Setara Kas
        if ($request->has('l1a1_data')) {
            SptOpL1A1::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a1_data', []) as $data) {
                SptOpL1A1::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A2 - Piutang
        if ($request->has('l1a2_data')) {
            SptOpL1A2::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a2_data', []) as $data) {
                SptOpL1A2::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A3 - Investasi
        if ($request->has('l1a3_data')) {
            SptOpL1A3::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a3_data', []) as $data) {
                SptOpL1A3::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A4 - Kendaraan
        if ($request->has('l1a4_data')) {
            SptOpL1A4::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a4_data', []) as $data) {
                SptOpL1A4::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A5 - Tanah dan Bangunan
        if ($request->has('l1a5_data')) {
            SptOpL1A5::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a5_data', []) as $data) {
                SptOpL1A5::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A6 - Harta Bergerak Lainnya
        if ($request->has('l1a6_data')) {
            SptOpL1A6::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a6_data', []) as $data) {
                SptOpL1A6::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1A7 - Harta Tidak Bergerak Lainnya
        if ($request->has('l1a7_data')) {
            SptOpL1A7::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1a7_data', []) as $data) {
                SptOpL1A7::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1B - Kewajiban/Utang
        if ($request->has('l1b_data')) {
            SptOpL1B::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1b_data', []) as $data) {
                SptOpL1B::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1C - Daftar Susunan Anggota Keluarga
        if ($request->has('l1c_data')) {
            SptOpL1C::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1c_data', []) as $data) {
                SptOpL1C::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1D - Penghasilan Neto Dalam Negeri dari Pekerjaan
        if ($request->has('l1d_data')) {
            SptOpL1D::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1d_data', []) as $data) {
                SptOpL1D::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 1E - Penghasilan yang Dikenakan PPh Final
        if ($request->has('l1e_data')) {
            SptOpL1E::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l1e_data', []) as $data) {
                SptOpL1E::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 2A - PPh yang Dipotong/Dipungut oleh Pihak Lain
        if ($request->has('l2a_data')) {
            SptOpL2A::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l2a_data', []) as $data) {
                SptOpL2A::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 2B - PPh yang Dibayar/Disetor Sendiri
        if ($request->has('l2b_data')) {
            SptOpL2B::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l2b_data', []) as $data) {
                SptOpL2B::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 2C - Penghasilan dari Luar Negeri
        if ($request->has('l2c_data')) {
            SptOpL2C::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l2c_data', []) as $data) {
                SptOpL2C::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3A-1/3A1 - Laporan Laba Rugi
        if ($request->has('l3a13a1_data')) {
            SptOpL3A13A1::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3a13a1_data', []) as $data) {
                SptOpL3A13A1::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3A-1/3A2 - Neraca
        if ($request->has('l3a13a2_data')) {
            SptOpL3A13A2::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3a13a2_data', []) as $data) {
                SptOpL3A13A2::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3A-4A - Penghasilan Neto dari Pekerjaan Bebas/Usaha
        if ($request->has('l3a4a_data')) {
            SptOpL3A4A::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3a4a_data', []) as $data) {
                SptOpL3A4A::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3A-4B - Penghasilan Neto Lainnya
        if ($request->has('l3a4b_data')) {
            SptOpL3A4B::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3a4b_data', []) as $data) {
                SptOpL3A4B::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3B - Peredaran Bruto PP 23/PP 55
        if ($request->has('l3b_data')) {
            SptOpL3B::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3b_data', []) as $data) {
                SptOpL3B::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3C - Daftar Penyusutan/Amortisasi
        if ($request->has('l3c_data')) {
            SptOpL3C::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3c_data', []) as $data) {
                SptOpL3C::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3D-A - Daftar Biaya Entertainment
        if ($request->has('l3da_data')) {
            SptOpL3DA::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3da_data', []) as $data) {
                SptOpL3DA::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3D-B - Transaksi dengan Pihak Afiliasi
        if ($request->has('l3db_data')) {
            SptOpL3DB::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3db_data', []) as $data) {
                SptOpL3DB::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 3D-C - Piutang Tak Tertagih
        if ($request->has('l3dc_data')) {
            SptOpL3DC::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l3dc_data', []) as $data) {
                SptOpL3DC::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 4A - Perhitungan PPh Terutang
        if ($request->has('l4a_data')) {
            $l4aData = $request->input('l4a_data');
            SptOpL4A::updateOrCreate(
                ['spt_op_id' => $sptOpId],
                $l4aData
            );
        }

        // Lampiran 5A - Kompensasi Kerugian
        if ($request->has('l5a_data')) {
            SptOpL5A::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l5a_data', []) as $data) {
                SptOpL5A::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }

        // Lampiran 5B/C - Pengurang PPh
        if ($request->has('l5bc_data')) {
            SptOpL5BC::where('spt_op_id', $sptOpId)->delete();
            foreach ($request->input('l5bc_data', []) as $data) {
                SptOpL5BC::create(array_merge($data, ['spt_op_id' => $sptOpId]));
            }
        }
    }

    /**
     * Handle payment process
     */
    private function handlePayment(Request $request, $user, $spt, $sptOp, $activeCourseId, $paymentMethod, $taxValue)
    {
        $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
        $billingFormId = $lastBillingFormId + 1;

        $billingData = $request->input('billing_data');
        $billing = new Billing([
            'user_id' => $user->id,
            'spt_id' => $spt->id,
            'billing_type_id' => $billingData['billing_type_id'],
            'billing_form_id' => $billingFormId,
            'start_period' => $billingData['start_period'],
            'end_period' => $billingData['end_period'],
            'year' => $billingData['year'],
            'currency' => $billingData['currency'],
            'amount' => $billingData['amount'],
            'amount_in_words' => $billingData['amount_in_words'],
            'description' => $billingData['description'],
            'status' => $paymentMethod === 'deposit' ? 'paid' : 'unpaid',
            'active_period' => $billingData['active_period'],
            'code' => $billingData['code'],
        ]);
        $billing->save();

        // Link billing to active course
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
                'spt_id' => $spt->id,
            ]);
        }

        $ledgerData = $request->input('ledger_data');
        $correctionType = $spt->correction_number == 1 ? 'spt pembetulan' : 'spt normal';

        if ($paymentMethod === 'billing') {
            $ledger = new Ledger([
                'user_id' => $user->id,
                'billing_id' => $billing->id,
                'billing_type_id' => $ledgerData['billing_type_id'],
                'transaction_date' => $ledgerData['transaction_date'],
                'posting_date' => $ledgerData['posting_date'],
                'accounting_type' => $ledgerData['accounting_type'],
                'accounting_type_detail' => $correctionType,
                'currency' => $ledgerData['currency'],
                'transaction_type' => $ledgerData['transaction_type'],
                'debit_amount' => -$billingData['amount'],
                'debit_unpaid' => 0,
                'credit_amount' => 0,
                'credit_left' => 0,
                'kap' => $ledgerData['kap'],
                'kap_description' => $ledgerData['kap_description'],
                'kjs' => $ledgerData['kjs'],
                'tax_period' => $ledgerData['tax_period'],
                'transaction_number' => $ledgerData['transaction_number'],
            ]);
            $ledger->save();

            $exists = CourseResult::where('course_user_id', $courseUser->id)
                ->where('ledger_id', $ledger->id)
                ->exists();
            if (!$exists) {
                CourseResult::create([
                    'course_user_id' => $courseUser->id,
                    'billing_id' => $billing->id,
                    'ledger_id' => $ledger->id,
                    'spt_id' => $spt->id,
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
                    'transaction_type' => 'credit',
                    'accounting_type_detail' => $correctionType,
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
                    'debit_amount' => ($entry['accounting_type'] === 'pembayaran' || $entry['accounting_type'] === 'pengembalian' || $entry['accounting_type'] === 'penyesuaian')
                        ? -abs($ledgerData['debit_amount'])
                        : 0,
                    'debit_unpaid' => $ledgerData['debit_unpaid'] ?? 0,
                    'credit_amount' => $entry['accounting_type'] === 'surat pemberitahuan'
                        ? abs($ledgerData['debit_amount'])
                        : 0,
                    'credit_left' => $ledgerData['credit_left'] ?? 0,
                    'kap' => $ledgerData['kap'],
                    'kap_description' => $ledgerData['kap_description'],
                    'kjs' => $ledgerData['kjs'],
                    'tax_period' => $ledgerData['tax_period'],
                    'transaction_number' => $ledgerData['transaction_number'],
                ]);
                $ledger->save();

                $exists = CourseResult::where('course_user_id', $courseUser->id)
                    ->where('ledger_id', $ledger->id)
                    ->exists();
                if (!$exists) {
                    CourseResult::create([
                        'course_user_id' => $courseUser->id,
                        'billing_id' => $billing->id,
                        'ledger_id' => $ledger->id,
                        'spt_id' => $spt->id,
                    ]);
                }
            }
        }
    }

    /**
     * Save draft SPT OP (without submission)
     */
    public function saveDraft(Request $request)
    {
        if (session('active_business_entity_id')) {
            return response()->json(['error' => 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.'], 403);
        }

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return response()->json(['error' => 'Active course belum dipilih.'], 400);
        }

        try {
            $sptId = $request->input('spt_id');

            // Verify SPT belongs to active course
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
                ->whereHas('form', function ($q) {
                    $q->where('code', 'PPHOP');
                })
                ->findOrFail($sptId);

            // Create or update SptOp
            $sptOpData = $this->extractSptOpData($request);
            $sptOpData['spt_id'] = $sptId;

            $sptOp = SptOp::updateOrCreate(
                ['spt_id' => $sptId],
                $sptOpData
            );



            // Handle lampiran data
            $this->saveLampiranData($request, $sptOp->id);

            return response()->json(['success' => true, 'message' => 'Draft berhasil disimpan.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function uploadAttachment(Request $request)
    {
        if (session('active_business_entity_id')) {
            return response()->json(['error' => 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.'], 403);
        }

        $allowedFields = ['j_a_file', 'j_b_file', 'j_c_file', 'j_d_file', 'j_e_file'];

        $request->validate([
            'spt_op_id' => 'required|string|exists:spt_op,id',
            'field' => 'nullable|string|in:' . implode(',', $allowedFields),
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'j_a_file' => 'nullable|file|mimes:pdf|max:10240',
            'j_b_file' => 'nullable|file|mimes:pdf|max:10240',
            'j_c_file' => 'nullable|file|mimes:pdf|max:10240',
            'j_d_file' => 'nullable|file|mimes:pdf|max:10240',
            'j_e_file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $field = $request->input('field');
        $uploadedFile = $request->file('file');

        if (!$field || !$uploadedFile) {
            foreach ($allowedFields as $candidate) {
                if ($request->hasFile($candidate)) {
                    $field = $candidate;
                    $uploadedFile = $request->file($candidate);
                    break;
                }
            }
        }

        if (!$field || !$uploadedFile || !in_array($field, $allowedFields, true)) {
            return response()->json(['error' => 'File attachment tidak valid.'], 422);
        }

        $sptOp = SptOp::findOrFail($request->spt_op_id);

        if ($sptOp->{$field}) {
            Storage::disk('public')->delete($sptOp->{$field});
        }

        $originalName = $uploadedFile->getClientOriginalName();
        $path = $uploadedFile->store('spt-attachments', 'public');

        $updates = [$field => $path];
        $nameColumn = $field . '_name';
        if (Schema::hasColumn('spt_op', $nameColumn)) {
            $updates[$nameColumn] = $originalName;
        }

        $sptOp->update($updates);

        return response()->json([
            'success' => true,
            'field' => $field,
            'path' => $path,
            'original_name' => $originalName,
        ]);
    }

    /**
     * Download BPE for SPT OP
     */
    public function downloadBPEOp($id)
    {
        if (session('active_business_entity_id')) {
            abort(403, 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.');
        }

        $activeCourseId = session('active_course_id');

        $spt = Spt::with(['form', 'user'])
            ->when($activeCourseId, function ($q) use ($activeCourseId) {
                $q->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                    $q2->where('course_id', $activeCourseId);
                });
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHOP');
            })
            ->findOrFail($id);

        if (!$spt->ntte) {
            abort(404, 'BPE belum tersedia. SPT belum dilaporkan.');
        }

        $user = $spt->user ?? \Illuminate\Support\Facades\Auth::user();
        $sptOp = SptOp::where('spt_id', $spt->id)->firstOrFail();

        Carbon::setLocale('id');
        $formattedDate = Carbon::parse($spt->updated_at)->translatedFormat('d F Y');

        $pdf = Pdf::loadView('pdf/bpe_op', compact('spt', 'user', 'sptOp', 'formattedDate'));

        return $pdf->stream('BPE_PPh_OP_' . $user->name . '_' . $spt->year . '.pdf');
    }

    /**
     * Download SPT OP PDF
     */
    public function downloadSPTOp($id)
    {
        if (session('active_business_entity_id')) {
            abort(403, 'SPT Orang Pribadi tidak dapat diakses saat bertindak sebagai Badan Usaha.');
        }

        $activeCourseId = session('active_course_id');

        $spt = Spt::with(['form', 'user'])
            ->when($activeCourseId, function ($q) use ($activeCourseId) {
                $q->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                    $q2->where('course_id', $activeCourseId);
                });
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHOP');
            })
            ->findOrFail($id);

        $user = $spt->user ?? \Illuminate\Support\Facades\Auth::user();
        $sptOp = SptOp::where('spt_id', $spt->id)->firstOrFail();

        $pdf = Pdf::loadView('pdf/spt_op', compact('spt', 'user', 'sptOp'));
        $pdf->setPaper('A4', 'portrait');

        return $pdf->stream('SPT_PPh_OP_' . $user->name . '_' . $spt->year . '.pdf');
    }
}
