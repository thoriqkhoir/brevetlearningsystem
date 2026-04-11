<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B3;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B3Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'       => ['required', 'uuid', 'exists:spt_badan,id'],
            'tax_year'           => ['nullable', 'string'],
            'taxable_income'     => ['nullable', 'integer'],
            'tax_income'         => ['nullable', 'integer'],
            'income_after_reduce'=> ['nullable', 'integer'],
        ]);

        SptBadanL12B3::create([
            'id'                 => (string) Str::uuid(),
            'spt_badan_id'       => $validated['spt_badan_id'],
            'tax_year'           => $validated['tax_year']            ?? null,
            'taxable_income'     => $validated['taxable_income']      ?? 0,
            'tax_income'         => $validated['tax_income']          ?? 0,
            'income_after_reduce'=> $validated['income_after_reduce'] ?? 0,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'tax_year'           => ['nullable', 'string'],
            'taxable_income'     => ['nullable', 'integer'],
            'tax_income'         => ['nullable', 'integer'],
            'income_after_reduce'=> ['nullable', 'integer'],
        ]);

        $record = SptBadanL12B3::findOrFail($id);
        $record->update([
            'tax_year'           => $validated['tax_year']            ?? null,
            'taxable_income'     => $validated['taxable_income']      ?? 0,
            'tax_income'         => $validated['tax_income']          ?? 0,
            'income_after_reduce'=> $validated['income_after_reduce'] ?? 0,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B3::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
