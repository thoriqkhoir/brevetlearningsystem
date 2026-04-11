<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LedgerController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');

        $query = Ledger::with(['user', 'billingType'])
            ->where('user_id', $user->id);

        if ($activeCourseId) {
            $query->forCourse($activeCourseId);
        } else {
            // Tanpa kelas aktif, tampilkan kosong agar tidak bocor antar kelas
            return Inertia::render('Payment/BukuBesar', [
                'ledgers' => collect(),
                'active_course_id' => null,
                'no_active_course' => true,
            ]);
        }

        $ledgers = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Payment/BukuBesar', [
            'ledgers' => $ledgers,
            'active_course_id' => $activeCourseId,
            'no_active_course' => false,
        ]);
    }

    public function generatePDF()
    {
        $user = Auth::user();
        $activeCourseId = session('active_course_id');
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $query = Ledger::with(['user', 'billingType'])
            ->where('user_id', $user->id)
            ->whereYear('transaction_date', $currentYear)
            ->whereMonth('transaction_date', $currentMonth);

        if ($activeCourseId) {
            $query->forCourse($activeCourseId);
        } else {
            $ledgers = collect();
            $data = [
                'ledgers' => $ledgers,
                'totalCredit' => 0,
                'totalDebit' => 0,
                'totalDebitUnpaid' => 0,
                'totalCreditLeft' => 0,
                'user' => $user,
                'date' => now()->format('d F Y'),
                'month' => now()->translatedFormat('F Y'),
            ];
            $pdf = Pdf::loadView('pdf.ledger', $data);
            return $pdf->stream('taxpayer_ledger_transcript.pdf');
        }

        $ledgers = $query->orderBy('transaction_date', 'asc')->get();

        $data = [
            'ledgers' => $ledgers,
            'totalCredit' => $ledgers->sum('credit_amount'),
            'totalDebit' => $ledgers->sum('debit_amount'),
            'totalDebitUnpaid' => $ledgers->sum('debit_unpaid'),
            'totalCreditLeft' => $ledgers->sum('credit_left'),
            'user' => $user,
            'date' => now()->format('d F Y'),
            'month' => now()->translatedFormat('F Y'),
        ];

        $pdf = Pdf::loadView('pdf.ledger', $data);
        return $pdf->stream('taxpayer_ledger_transcript.pdf');
    }
}
