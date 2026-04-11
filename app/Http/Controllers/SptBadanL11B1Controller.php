<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11B1;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11B1Controller extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'          => ['required', 'uuid', 'exists:spt_badan,id'],
            'net_income'            => ['nullable', 'integer'],
            'depreciation_expense'  => ['nullable', 'integer'],
            'income_tax_expense'    => ['nullable', 'integer'],
            'loan_tax_expense'      => ['nullable', 'integer'],
            'ebtida'                => ['nullable', 'integer'],
            'ebtida_after_tax'      => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];

        $record = SptBadanL11B1::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->net_income           = $validated['net_income']           ?? 0;
        $record->depreciation_expense = $validated['depreciation_expense'] ?? 0;
        $record->income_tax_expense   = $validated['income_tax_expense']   ?? 0;
        $record->loan_tax_expense     = $validated['loan_tax_expense']     ?? 0;
        $record->ebtida               = $validated['ebtida']               ?? 0;
        $record->ebtida_after_tax     = $validated['ebtida_after_tax']     ?? 0;

        $record->save();

        return back();
    }
}
