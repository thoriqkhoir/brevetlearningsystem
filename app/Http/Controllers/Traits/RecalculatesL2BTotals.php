<?php

namespace App\Http\Controllers\Traits;

use App\Models\SptOp;
use App\Models\SptOpL2B;

trait RecalculatesL2BTotals
{
    /**
     * Recalculate L2B totals (sum of gross_income) and update SptOp.i_14_d_value.
     */
    protected function recalculateL2BTotals(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Calculate total gross income from L2B
        $totalGrossIncome = (int) SptOpL2B::where('spt_op_id', $sptOpId)->sum('gross_income');

        // Update SptOp with the total penghasilan bruto (I.14.d reference)
        $sptOp->update([
            'i_14_d_value' => $totalGrossIncome,
        ]);
    }
}
