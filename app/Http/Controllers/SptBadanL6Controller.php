<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL6;
use App\Models\SptBadanL7;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL6Controller extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'amount_1'     => ['nullable', 'integer'],
            'amount_2'     => ['nullable', 'integer'],
            'amount_3'     => ['nullable', 'integer'],
            'amount_4'     => ['nullable', 'integer'],
            'amount_5'     => ['nullable', 'integer'],
            'amount_6'     => ['nullable', 'integer'],
            'amount_7'     => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];
        $amount1 = (int) ($validated['amount_1'] ?? 0);
        $amount4 = (int) ($validated['amount_4'] ?? 0);
        $amount5 = (int) ($validated['amount_5'] ?? 0);
        $amount2FromL7 = (int) SptBadanL7::where('spt_badan_id', $sptBadanId)
            ->sum('year_now');

        $amount3 = max(0, $amount1 - $amount2FromL7);
        $amount6 = max(0, $amount4 - $amount5);
        $amount7 = $amount6 > 0 ? (int) ceil($amount6 / 12) : 0;

        $record = SptBadanL6::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->amount_1 = $amount1;
        $record->amount_2 = $amount2FromL7;
        $record->amount_3 = $amount3;
        $record->amount_4 = $amount4;
        $record->amount_5 = $amount5;
        $record->amount_6 = $amount6;
        $record->amount_7 = $amount7;

        $record->save();

        SptBadan::where('id', $sptBadanId)->update([
            'g_20_value' => $amount7,
        ]);

        return back();
    }
}
