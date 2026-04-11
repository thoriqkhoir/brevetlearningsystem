<?php

namespace App\Http\Controllers;

use App\Models\SptOpL4A;
use App\Models\SptOp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL4AController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'regular_net_income' => ['nullable', 'integer'],
            'final_loss' => ['nullable', 'integer'],
            'zakat' => ['nullable', 'integer'],
            'total_net_income' => ['nullable', 'integer'],
            'ptkp' => ['nullable', 'string', 'max:20'],
            'taxable_income' => ['nullable', 'integer'],
            'income_tax_payable' => ['nullable', 'integer'],
            'income_tax_deduction' => ['nullable', 'integer'],
            'tax_credit' => ['nullable', 'integer'],
            'income_tax_must_paid' => ['nullable', 'integer'],
            'tax_installments' => ['nullable', 'integer'],
        ]);

        $sptOpId = $validated['spt_op_id'];

        $record = SptOpL4A::firstOrNew(['spt_op_id' => $sptOpId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->regular_net_income = (int) ($validated['regular_net_income'] ?? 0);
        $record->final_loss = (int) ($validated['final_loss'] ?? 0);
        $record->zakat = (int) ($validated['zakat'] ?? 0);
        $record->total_net_income = (int) ($validated['total_net_income'] ?? 0);
        $record->ptkp = $validated['ptkp'] ?? null;
        $record->taxable_income = (int) ($validated['taxable_income'] ?? 0);
        $record->income_tax_payable = (int) ($validated['income_tax_payable'] ?? 0);
        $record->income_tax_deduction = (int) ($validated['income_tax_deduction'] ?? 0);
        $record->tax_credit = (int) ($validated['tax_credit'] ?? 0);
        $record->income_tax_must_paid = (int) ($validated['income_tax_must_paid'] ?? 0);
        $record->tax_installments = (int) ($validated['tax_installments'] ?? 0);

        $record->save();

        // Sinkronkan ke SPT OP (bagian H.13.b) agar angsuran terisi otomatis
        $installments = (int) ($validated['tax_installments'] ?? 0);
        if ($sptOp = SptOp::find($sptOpId)) {
            $sptOp->h_13_b = $installments > 0;
            $sptOp->h_13_b_value = $installments;
            $sptOp->save();
        }

        return back();
    }
}
