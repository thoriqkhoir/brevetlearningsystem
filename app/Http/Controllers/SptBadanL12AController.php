<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12AController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'       => ['required', 'uuid', 'exists:spt_badan,id'],
            'taxable_income'     => ['nullable', 'integer'],
            'pph_payable'        => ['nullable', 'integer'],
            'dpp'                => ['nullable', 'integer'],
            'pph_26_a'           => ['nullable', 'boolean'],
            'pph_26_a_value'     => ['nullable', 'integer'],
            'pph_26_b'           => ['nullable', 'boolean'],
            'pph_26_b_1'         => ['nullable', 'boolean'],
            'pph_26_b_1_value'   => ['nullable', 'integer'],
            'pph_26_b_2'         => ['nullable', 'boolean'],
            'pph_26_b_2_a'       => ['nullable', 'boolean'],
            'pph_26_b_2_a_value' => ['nullable', 'string'],
            'pph_26_b_2_b'       => ['nullable', 'boolean'],
            'pph_26_b_2_b_value' => ['nullable', 'string'],
            'pph_26_b_2_c'       => ['nullable', 'boolean'],
            'pph_26_b_2_d'       => ['nullable', 'boolean'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];

        $record = SptBadanL12A::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->taxable_income     = $validated['taxable_income']     ?? 0;
        $record->pph_payable        = $validated['pph_payable']        ?? 0;
        $record->dpp                = $validated['dpp']                ?? 0;
        $record->pph_26_a           = $validated['pph_26_a']           ?? null;
        $record->pph_26_a_value     = $validated['pph_26_a_value']     ?? 0;
        $record->pph_26_b           = $validated['pph_26_b']           ?? null;
        $record->pph_26_b_1         = $validated['pph_26_b_1']         ?? null;
        $record->pph_26_b_1_value   = $validated['pph_26_b_1_value']   ?? 0;
        $record->pph_26_b_2         = $validated['pph_26_b_2']         ?? null;
        $record->pph_26_b_2_a       = $validated['pph_26_b_2_a']       ?? null;
        $record->pph_26_b_2_a_value = $validated['pph_26_b_2_a_value'] ?? null;
        $record->pph_26_b_2_b       = $validated['pph_26_b_2_b']       ?? null;
        $record->pph_26_b_2_b_value = $validated['pph_26_b_2_b_value'] ?? null;
        $record->pph_26_b_2_c       = $validated['pph_26_b_2_c']       ?? null;
        $record->pph_26_b_2_d       = $validated['pph_26_b_2_d']       ?? null;

        $record->save();

        return back();
    }
}
