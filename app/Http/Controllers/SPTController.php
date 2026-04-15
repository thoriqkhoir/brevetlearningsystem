<?php

namespace App\Http\Controllers;

use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\MasterForm;
use App\Models\Spt;
use App\Models\SptBadan;
use App\Models\SptOp;
use Illuminate\Http\Request;
use App\Models\Other;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Ledger;
use App\Models\Retur;
use App\Models\ReturOther;
use App\Models\SptUnifikasi;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\MasterBillingType;

class SPTController extends Controller
{
    private function applyImpersonationScope($query, ?string $activeBusinessEntityId): void
    {
        if ($activeBusinessEntityId) {
            $query->where(function ($q) use ($activeBusinessEntityId) {
                $q->whereHas('form', function ($formQ) {
                    $formQ->whereNotIn('code', ['PPHOP', 'PPHBADAN']);
                })->orWhere(function ($ownedBadanQ) use ($activeBusinessEntityId) {
                    $ownedBadanQ->whereHas('form', function ($formQ) {
                        $formQ->where('code', 'PPHBADAN');
                    })->whereHas('sptBadan', function ($badanQ) use ($activeBusinessEntityId) {
                        $badanQ->where('business_entity_id', $activeBusinessEntityId);
                    });
                });
            });

            return;
        }

        $query->whereHas('form', function ($formQ) {
            $formQ->where('code', '!=', 'PPHBADAN');
        });
    }

    public function index()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/KonsepSPT/KonsepSPT', [
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $activeBusinessEntityId = session('active_business_entity_id');
        $sptQuery = Spt::with('form')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', $user->id)
            ->whereIn('status', ['created', 'amanded'])
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/KonsepSPT/KonsepSPT', [
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function waiting()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/SPTMenunggu', [
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $activeBusinessEntityId = session('active_business_entity_id');
        $sptQuery = Spt::with(['form', 'sptInduk'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', $user->id)
            ->where('status', 'waiting')
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/SPTMenunggu', [
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function submitted()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/SPTDilaporkan', [
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $activeBusinessEntityId = session('active_business_entity_id');
        $sptQuery = Spt::with('form')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/SPTDilaporkan', [
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function rejected()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/SPTDitolak', [
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $activeBusinessEntityId = session('active_business_entity_id');
        $sptQuery = Spt::with('form')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', $user->id)
            ->where('status', 'rejected')
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/SPTDitolak', [
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function canceled()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/SPTDibatalkan', [
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $user = Auth::user();
        $activeBusinessEntityId = session('active_business_entity_id');
        $sptQuery = Spt::with('form')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', $user->id)
            ->where('status', 'canceled')
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/SPTDibatalkan', [
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function create()
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return Inertia::render('SPT/KonsepSPT/FormKonsepSPT', [
                'forms' => [],
                'spts' => [],
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $activeBusinessEntityId = session('active_business_entity_id');
        $formsQuery = MasterForm::query();
        if ($activeBusinessEntityId) {
            // Acting as Business Entity: hide PPh Orang Pribadi
            $formsQuery->where('code', '!=', 'PPHOP');
        } else {
            // Acting as Personal: hide SPT PPN and PPh Badan
            $formsQuery->where('code', '!=', 'PPN1111');
            $formsQuery->where('code', '!=', 'PPHBADAN');
        }
        $forms = $formsQuery->get();
        $sptQuery = Spt::with('form')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        $this->applyImpersonationScope($sptQuery, $activeBusinessEntityId);
        $spts = $sptQuery->get();

        return Inertia::render('SPT/KonsepSPT/FormKonsepSPT', [
            'forms' => $forms,
            'spts' => $spts,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'form_id' => 'required|exists:master_forms,id',
            'correction_number' => 'required|integer',
            'start_period' => 'required|string|max:255',
            'end_period' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'spt_period_type' => 'nullable|in:tahunan,bagian_tahun_pajak',
            'tax_type' => 'required|in:nihil,kurang bayar,lebih bayar',
            'tax_value' => 'required|numeric',
            'status' => 'required|in:created,approved,canceled,rejected,amanded,waiting',
        ]);

        $selectedForm = MasterForm::find($validated['form_id']);

        // Enforce impersonation context restrictions server-side
        $activeBusinessEntityId = $request->session()->get('active_business_entity_id');
        if ($selectedForm) {
            if ($activeBusinessEntityId && $selectedForm->code === 'PPHOP') {
                return back()
                    ->withErrors(['form_id' => 'PPh Orang Pribadi tidak dapat dipilih saat bertindak sebagai Badan Usaha.'])
                    ->withInput();
            }
            if (!$activeBusinessEntityId && $selectedForm->code === 'PPHBADAN') {
                return back()
                    ->withErrors(['form_id' => 'PPh Badan hanya dapat dipilih saat bertindak sebagai Badan Usaha.'])
                    ->withInput();
            }
        }

        if (
            $selectedForm &&
            $selectedForm->code === 'PPN1111' &&
            !$request->session()->get('active_business_entity_id')
        ) {
            return back()
                ->withErrors(['form_id' => 'SPT PPN hanya dapat dipilih saat bertindak sebagai Badan Usaha.'])
                ->withInput();
        }

        if ($selectedForm && in_array($selectedForm->code, ['PPHOP', 'PPHBADAN'], true)) {
            if (empty($validated['spt_period_type'])) {
                return back()
                    ->withErrors(['spt_period_type' => 'Jenis Periode SPT wajib dipilih untuk SPT Tahunan (OP/Badan).'])
                    ->withInput();
            }

            $expectedYear = (string) (now()->year - 1);
            if ($validated['year'] !== $expectedYear) {
                return back()
                    ->withErrors(['year' => 'Tahun pajak untuk SPT Tahunan (OP/Badan) harus tahun sebelumnya.'])
                    ->withInput();
            }

            if ($validated['spt_period_type'] === 'tahunan') {
                if ($validated['start_period'] !== 'Januari' || $validated['end_period'] !== 'Desember') {
                    return back()
                        ->withErrors(['start_period' => 'Untuk SPT Tahunan, periode harus Januari - Desember.'])
                        ->withInput();
                }
            }
        }

        if ($validated['correction_number'] == 1) {
            Spt::where('user_id', Auth::id())
                ->where('form_id', $validated['form_id'])
                ->where('start_period', $validated['start_period'])
                ->where('end_period', $validated['end_period'])
                ->where('status', 'created')
                ->where('year', $validated['year'])
                ->update(['status' => 'amanded']);
        }

        $spt = new Spt($validated);
        $spt->user_id = Auth::id();
        $spt->save();

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
                    'spt_id' => $spt->id,
                    'score' => null,
                ]);
            }
        }

        // Redirect to SPT OP detail page if form is PPHOP
        if ($selectedForm && $selectedForm->code === 'PPHOP') {
            // Ensure SPT OP record exists so each tab can persist its own data using spt_op_id
            if (Schema::hasColumn('spt_op', 'is_initialized')) {
                SptOp::firstOrCreate(
                    ['spt_id' => $spt->id],
                    ['is_initialized' => false]
                );
            } else {
                SptOp::firstOrCreate([
                    'spt_id' => $spt->id,
                ]);
            }

            return redirect()->route('spt.detailOp', ['id' => $spt->id])->with('success', 'Berhasil membuat Konsep SPT Orang Pribadi.');
        }

        if ($selectedForm && $selectedForm->code === 'PPHBADAN') {
            $activeBusinessEntityId = $request->session()->get('active_business_entity_id');

            if (!$activeBusinessEntityId) {
                return redirect()->route('spt.konsep')->with('error', 'Badan usaha aktif belum dipilih.');
            }

            SptBadan::firstOrCreate(
                [
                    'spt_id' => $spt->id,
                    'business_entity_id' => $activeBusinessEntityId,
                ],
                [
                    'type_of_bookkeeping' => 'pencatatan',
                ]
            );

            return redirect()->route('spt.detailBadan', ['id' => $spt->id])->with('success', 'Berhasil membuat Konsep SPT Badan.');
        }

        return redirect()->route('spt.konsep')->with('success', 'Berhasil membuat Konsep SPT.');
    }

    public function show($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'Active course not set');
        }

        $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
            $q->where('course_id', $activeCourseId);
        })->findOrFail($id);
        $user = Auth::user();

        // Scope ledger ke course aktif agar saldo tidak bocor dari kelas lain
        $ledgers = Ledger::where('user_id', $user->id)
            ->forCourse($activeCourseId)
            ->get();

        $totalCredit = $ledgers->sum('credit_amount');
        $totalDebit = $ledgers->sum('debit_amount');
        $totalDebitUnpaid = $ledgers->sum('debit_unpaid');
        $totalCreditLeft = $totalDebit + $totalCredit;
        $saldo = $totalCreditLeft - $totalDebitUnpaid;

        $invoices = Invoice::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('invoice_period', $spt->start_period)
            ->where('invoice_year', $spt->year)
            ->get();

        $others = Other::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('other_period', $spt->start_period)
            ->where('other_year', $spt->year)
            ->get();

        $invoiceIds = $invoices->pluck('id')->toArray();
        $returns = Retur::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereIn('invoice_id', $invoiceIds)
            ->get();

        $otherIds = $others->pluck('id')->toArray();
        $returnsOthers = ReturOther::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereIn('other_id', $otherIds)
            ->get();

        $kap = "411211";
        $kjs = "100";
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

        return inertia('SPT/DetailSPT', [
            'spt' => $spt,
            'invoices' => $invoices,
            'others' => $others,
            'returns' => $returns,
            'returnsOthers' => $returnsOthers,
            'saldo' => $saldo,
            'transactionNumber' => $transactionNumber,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:created,approved,canceled,deleted,amanded',
            'password' => 'required|string',
        ]);

        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'Active course not set');
        }

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('spt.konsep')->with('error', 'Password salah!');
        }

        try {
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->findOrFail($id);
            $spt->status = $validated['status'];

            if ($spt->status === 'approved') {
                $year = $spt->year;
                $sptCount = Spt::whereYear('created_at', $year)->count();
                $sequence = str_pad($sptCount, 5, '0', STR_PAD_LEFT);
                $spt->ntte = "BPE-{$sequence}/CT/KPP/{$year}";
            }

            $spt->save();

            if ($spt->status === 'canceled') {
                return redirect()->route('spt.canceled')->with('success', 'SPT berhasil dibatalkan.');
            } else if ($spt->status === 'approved') {
                return redirect()->route('spt.submitted')->with('success', 'SPT berhasil dilaporkan.');
            }
        } catch (\Exception $e) {
            if ($spt->status === 'canceled') {
                return redirect()->route('spt.konsep')->with('success', 'SPT gagal dibatalkan.');
            } else if ($spt->status === 'approved') {
                return redirect()->route('spt.waiting')->with('success', 'SPT gagal dilaporkan.');
            }
        }
    }

    public function downloadPDF($id)
    {
        $user = Auth::user();
        $spt = Spt::with(['form', 'sptInduk'])->findOrFail($id);
        $pdf = PDF::loadView('pdf/spt', compact('spt', 'user'));
        return $pdf->stream('SPT_PPN_' . $user->name . '.pdf');
    }

    public function downloadPDFUnifikasi($id)
    {
        $user = Auth::user();
        $spt = Spt::with('form', 'sptUnifikasi')->findOrFail($id);
        $pdf = PDF::loadView('pdf/spt_unifikasi', compact('spt', 'user'));
        return $pdf->stream('SPT_PPH_UNIFIKASI_' . $user->name . '.pdf');
    }

    public function downloadPDF21($id)
    {
        $user = Auth::user();
        $spt = Spt::with(['form', 'spt2126'])->findOrFail($id);
        $pdf = PDF::loadView('pdf/spt_2126', compact('spt', 'user'));
        return $pdf->stream('SPT_PPH_2126_' . $user->name . '.pdf');
    }

    public function downloadBPE($id)
    {
        $user = Auth::user();
        $spt = Spt::with(['form', 'sptInduk', 'spt2126'])->findOrFail($id);
        Carbon::setLocale('id');
        $dateSource = $spt->sptInduk?->ttd_date ?? $spt->spt2126?->created_at ?? $spt->created_at;
        $formattedDate = Carbon::parse($dateSource)->translatedFormat('d F Y');
        $pdf = PDF::loadView('pdf/bpe', compact('spt', 'user', 'formattedDate'));
        return $pdf->stream('BPE_' . $user->name . '.pdf');
    }

    public function downloadBPEUnifikasi($id)
    {
        $user = Auth::user();
        $spt = Spt::with(['form', 'sptUnifikasi'])->findOrFail($id);
        $sptUnifikasi = $spt->sptUnifikasi;
        if (!$sptUnifikasi) {
            abort(404, 'Data SPT Unifikasi tidak ditemukan.');
        }
        Carbon::setLocale('id');
        $formattedDate = Carbon::parse($sptUnifikasi->created_at)->translatedFormat('d F Y');
        $pdf = PDF::loadView('pdf/bpe_unifikasi', [
            'spt' => $spt,
            'user' => $user,
            'formattedDate' => $formattedDate,
        ]);

        return $pdf->stream('BPE_UNIFIKASI_' . $user->name . '.pdf');
    }

    public function downloadBPE21($id)
    {
        $user = Auth::user();
        $spt = Spt::with('form', 'spt2126')->findOrFail($id);
        $spt2126 = $spt->spt2126;

        if (!$spt2126) {
            abort(404, 'Data SPT PPh 21/26 tidak ditemukan.');
        }

        Carbon::setLocale('id');
        $formattedDate = Carbon::parse($spt2126->created_at ?? $spt->created_at)->translatedFormat('d F Y');

        $pdf = PDF::loadView('pdf/bpe_2126', [
            'spt' => $spt,
            'user' => $user,
            'formattedDate' => $formattedDate,
            'spt2126' => $spt2126,
        ]);

        return $pdf->stream('BPE_PPH2126_' . $user->name . '.pdf');
    }

    public function detailUni($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'Active course not set');
        }
        $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
            $q->where('course_id', $activeCourseId);
        })->findOrFail($id);
        $user = Auth::user();
        $masterBillingTypes = MasterBillingType::all();
        // Scope ledger ke course aktif
        $ledgers = Ledger::where('user_id', $user->id)
            ->forCourse($activeCourseId)
            ->get();

        $totalCredit = $ledgers->sum('credit_amount');
        $totalDebit = $ledgers->sum('debit_amount');
        $totalDebitUnpaid = $ledgers->sum('debit_unpaid');
        $totalCreditLeft = $totalDebit + $totalCredit;
        $saldo = $totalCreditLeft - $totalDebitUnpaid;

        $bupots = \App\Models\Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('bupot_period', $spt->start_period)
            ->where('bupot_year', $spt->year)
            ->get();


        $kap = "411211";
        $kjs = "100";
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

        return inertia('SPT/DetailSPTUni', [
            'spt' => $spt,
            'saldo' => $saldo,
            'transactionNumber' => $transactionNumber,
            'bupots' => $bupots,
            'masterBillingTypes' => $masterBillingTypes,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function detail21($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            abort(403, 'Active course not set');
        }
        $spt = Spt::with(['form', 'user'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->findOrFail($id);
        $user = Auth::user();

        // Get actual bupot data instead of empty array
        $bupots = \App\Models\Bupot::with('object')
            ->where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where('bupot_period', $spt->start_period)
            ->where('bupot_year', $spt->year)
            ->get();

        // Calculate other necessary values
        // Scope ledger ke course aktif
        $ledgers = Ledger::where('user_id', $user->id)
            ->forCourse($activeCourseId)
            ->get();
        $totalCredit = $ledgers->sum('credit_amount');
        $totalDebit = $ledgers->sum('debit_amount');
        $totalDebitUnpaid = $ledgers->sum('debit_unpaid');
        $saldo = ($totalDebit + $totalCredit) - $totalDebitUnpaid;

        // Generate transaction number if needed
        $kap = "411211";
        $kjs = "100";
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

        // Testing: tampilkan SEMUA BPA1 (hapus filter bulan)
        $bupotA1 = \App\Models\BupotA1::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where(function ($query) use ($spt) {
                // Match end_period dengan format "Desember" atau "Desember 2025"
                $query->where('end_period', $spt->start_period)
                    ->orWhere('end_period', 'LIKE', $spt->start_period . ' ' . $spt->year);
            })
            ->get();

        $bupotA2 = \App\Models\BupotA2::with('object')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->where(function ($query) use ($spt) {
                // Match end_period dengan format "Desember" atau "Desember 2025"
                $query->where('end_period', $spt->start_period)
                    ->orWhere('end_period', 'LIKE', $spt->start_period . ' ' . $spt->year);
            })
            ->get();

        return Inertia::render('SPT/DetailSPT21', [
            'spt' => $spt,
            'returnsOthers' => [],
            'saldo' => $saldo,
            'transactionNumber' => $transactionNumber,
            'bupots' => $bupots,
            'bupotA1' => $bupotA1,
            'bupotA2' => $bupotA2,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }
}
