<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL8;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL8Controller extends Controller
{
    private const FACILITY_GROSS_REVENUE_LIMIT = 4_800_000_000;
    private const FACILITY_ELIGIBLE_GROSS_REVENUE_LIMIT = 50_000_000_000;
    private const DEFAULT_NORMAL_TAX_RATE_PERCENT = 22;

    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'amount_1'     => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];
        $sptBadan = SptBadan::findOrFail($sptBadanId);

        $grossRevenue = max(0, (int) ($validated['amount_1'] ?? 0));
        $taxableIncome = max(0, (int) ($sptBadan->d_9 ?? 0));

        $configuredTaxRate = (float) ($sptBadan->d_11_percentage ?? 0);
        $normalTaxRate = $configuredTaxRate > 0
            ? $configuredTaxRate
            : self::DEFAULT_NORMAL_TAX_RATE_PERCENT;

        $isFacilityEligible =
            $grossRevenue > 0 &&
            $grossRevenue <= self::FACILITY_ELIGIBLE_GROSS_REVENUE_LIMIT;

        $facilityRatio = $isFacilityEligible
            ? min(1, self::FACILITY_GROSS_REVENUE_LIMIT / $grossRevenue)
            : 0;

        $amount2a = min(
            $taxableIncome,
            max(0, (int) round($taxableIncome * $facilityRatio))
        );
        $amount2b = max(0, $taxableIncome - $amount2a);

        $amount3a = (int) round($amount2a * (($normalTaxRate / 2) / 100));
        $amount3b = (int) round($amount2b * ($normalTaxRate / 100));
        $amount4 = $amount3a + $amount3b;

        $record = SptBadanL8::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->amount_1 = $grossRevenue;
        $record->amount_2a = $amount2a;
        $record->amount_2b = $amount2b;
        $record->amount_3a = $amount3a;
        $record->amount_3b = $amount3b;
        $record->amount_4 = $amount4;

        $record->save();

        return back();
    }
}
