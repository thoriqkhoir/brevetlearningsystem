<?php

namespace App\Http\Controllers\Traits;

use App\Models\SptOp;
use App\Models\SptOpL2A;

trait RecalculatesL2ATotals
{
    /**
     * Recalculate L2A totals (sum of pph_owed) and update SptOp.i_14_c_value.
     */
    protected function recalculateL2ATotals(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Calculate total PPh owed from L2A
        $totalPphOwed = (int) SptOpL2A::where('spt_op_id', $sptOpId)->sum('pph_owed');

        // Update SptOp with the total PPh terutang (I.14.c reference)
        $sptOp->update([
            'i_14_c_value' => $totalPphOwed,
        ]);
    }
}
