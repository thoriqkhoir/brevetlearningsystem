<?php

namespace App\Http\Controllers\Traits;

use App\Models\SptOp;
use App\Models\SptOpL1A1;
use App\Models\SptOpL1A2;
use App\Models\SptOpL1A3;
use App\Models\SptOpL1A4;
use App\Models\SptOpL1A5;
use App\Models\SptOpL1A6;
use App\Models\SptOpL1A7;

trait RecalculatesL1A7Totals
{
    /**
     * Recalculate L1A7 totals (sum of L1A1-L1A6) and update SptOp.
     * 
     * Harga Perolehan mapping:
     * - L1A1: integer (saldo)
     * - L1A2: amount (saldo awal)
     * - L1A3: acquisition_cost
     * - L1A4: acquisition_cost
     * - L1A5: acquisition_cost
     * - L1A6: acquisition_cost
     * 
     * Nilai Saat Ini mapping:
     * - L1A1: integer (saldo - same as acquisition)
     * - L1A2: amount_now (saldo akhir)
     * - L1A3: amount_now
     * - L1A4: amount_now
     * - L1A5: amount_now
     * - L1A6: amount_now
     */
    protected function recalculateL1A7Totals(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Calculate totals from each L1A table
        // L1A1: integer is both acquisition cost and current value
        $l1a1AcquisitionCost = (int) SptOpL1A1::where('spt_op_id', $sptOpId)->sum('integer');
        $l1a1AmountNow = $l1a1AcquisitionCost; // Same value for bank accounts

        // L1A2: amount is acquisition cost, amount_now is current value
        $l1a2AcquisitionCost = (int) SptOpL1A2::where('spt_op_id', $sptOpId)->sum('amount');
        $l1a2AmountNow = (int) SptOpL1A2::where('spt_op_id', $sptOpId)->sum('amount_now');

        // L1A3: acquisition_cost and amount_now
        $l1a3AcquisitionCost = (int) SptOpL1A3::where('spt_op_id', $sptOpId)->sum('acquisition_cost');
        $l1a3AmountNow = (int) SptOpL1A3::where('spt_op_id', $sptOpId)->sum('amount_now');

        // L1A4: acquisition_cost and amount_now
        $l1a4AcquisitionCost = (int) SptOpL1A4::where('spt_op_id', $sptOpId)->sum('acquisition_cost');
        $l1a4AmountNow = (int) SptOpL1A4::where('spt_op_id', $sptOpId)->sum('amount_now');

        // L1A5: acquisition_cost and amount_now
        $l1a5AcquisitionCost = (int) SptOpL1A5::where('spt_op_id', $sptOpId)->sum('acquisition_cost');
        $l1a5AmountNow = (int) SptOpL1A5::where('spt_op_id', $sptOpId)->sum('amount_now');

        // L1A6: acquisition_cost and amount_now
        $l1a6AcquisitionCost = (int) SptOpL1A6::where('spt_op_id', $sptOpId)->sum('acquisition_cost');
        $l1a6AmountNow = (int) SptOpL1A6::where('spt_op_id', $sptOpId)->sum('amount_now');

        // Calculate grand totals
        $totalAcquisitionCost = $l1a1AcquisitionCost + $l1a2AcquisitionCost + $l1a3AcquisitionCost
            + $l1a4AcquisitionCost + $l1a5AcquisitionCost + $l1a6AcquisitionCost;

        $totalAmountNow = $l1a1AmountNow + $l1a2AmountNow + $l1a3AmountNow
            + $l1a4AmountNow + $l1a5AmountNow + $l1a6AmountNow;

        // Update or create L1A7 aggregate row
        SptOpL1A7::updateOrCreate(
            ['spt_op_id' => $sptOpId],
            [
                'description' => 'JUMLAH HARTA PADA AKHIR TAHUN PAJAK',
                'acquisition_cost' => $totalAcquisitionCost,
                'amount_now' => $totalAmountNow,
            ],
        );

        // Update SptOp with the total harga perolehan (I.14.a reference)
        $sptOp->update([
            'i_14_a' => $totalAcquisitionCost,
        ]);
    }
}
