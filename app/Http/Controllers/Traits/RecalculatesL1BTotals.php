<?php

namespace App\Http\Controllers\Traits;

use App\Models\SptOp;
use App\Models\SptOpL1B;

trait RecalculatesL1BTotals
{
    /**
     * Recalculate L1B totals (sum of balance) and update SptOp.i_14_b_value.
     */
    protected function recalculateL1BTotals(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Calculate total balance from L1B
        $totalBalance = (int) SptOpL1B::where('spt_op_id', $sptOpId)->sum('balance');

        // Update SptOp with the total kewajiban (I.14.b reference)
        $sptOp->update([
            'i_14_b_value' => $totalBalance,
        ]);
    }
}
