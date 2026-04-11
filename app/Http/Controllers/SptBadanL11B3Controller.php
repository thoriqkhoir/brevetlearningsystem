<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11B3;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11B3Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'              => ['required', 'uuid', 'exists:spt_badan,id'],
            'cost_provider'             => ['required', 'string'],
            'average_debt_balance'      => ['nullable', 'integer'],
            'loan_cost'                 => ['nullable', 'integer'],
            'loan_cost_tax'             => ['nullable', 'integer'],
            'loan_cost_cannot_reduced'  => ['nullable', 'integer'],
        ]);

        SptBadanL11B3::create([
            'id'                       => (string) Str::uuid(),
            'spt_badan_id'             => $validated['spt_badan_id'],
            'cost_provider'            => $validated['cost_provider'],
            'average_debt_balance'     => $validated['average_debt_balance']     ?? 0,
            'loan_cost'                => $validated['loan_cost']                ?? 0,
            'loan_cost_tax'            => $validated['loan_cost_tax']            ?? 0,
            'loan_cost_cannot_reduced' => $validated['loan_cost_cannot_reduced'] ?? 0,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'cost_provider'            => ['required', 'string'],
            'average_debt_balance'     => ['nullable', 'integer'],
            'loan_cost'                => ['nullable', 'integer'],
            'loan_cost_tax'            => ['nullable', 'integer'],
            'loan_cost_cannot_reduced' => ['nullable', 'integer'],
        ]);

        $record = SptBadanL11B3::findOrFail($id);
        $record->update([
            'cost_provider'            => $validated['cost_provider'],
            'average_debt_balance'     => $validated['average_debt_balance']     ?? 0,
            'loan_cost'                => $validated['loan_cost']                ?? 0,
            'loan_cost_tax'            => $validated['loan_cost_tax']            ?? 0,
            'loan_cost_cannot_reduced' => $validated['loan_cost_cannot_reduced'] ?? 0,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL11B3::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
