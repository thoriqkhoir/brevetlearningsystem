<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL13BC;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13BCController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'            => ['required', 'uuid', 'exists:spt_badan,id'],
            'proposal_number'         => ['nullable', 'string'],
            'expenses_start_period'   => ['nullable', 'string'],
            'expenses_end_period'     => ['nullable', 'string'],
            'total_cost'              => ['nullable', 'numeric'],
            'year_acquisition'        => ['nullable', 'string'],
            'facilities_percentage'   => ['nullable', 'numeric'],
            'additional_gross_income' => ['nullable', 'numeric'],
        ]);

        SptBadanL13BC::create([
            'id'                      => (string) Str::uuid(),
            'spt_badan_id'            => $validated['spt_badan_id'],
            'proposal_number'         => $validated['proposal_number']         ?? null,
            'expenses_start_period'   => $validated['expenses_start_period']   ?? null,
            'expenses_end_period'     => $validated['expenses_end_period']     ?? null,
            'total_cost'              => $validated['total_cost']              ?? 0,
            'year_acquisition'        => $validated['year_acquisition']        ?? null,
            'facilities_percentage'   => $validated['facilities_percentage']   ?? 0,
            'additional_gross_income' => $validated['additional_gross_income'] ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'proposal_number'         => ['nullable', 'string'],
            'expenses_start_period'   => ['nullable', 'string'],
            'expenses_end_period'     => ['nullable', 'string'],
            'total_cost'              => ['nullable', 'numeric'],
            'year_acquisition'        => ['nullable', 'string'],
            'facilities_percentage'   => ['nullable', 'numeric'],
            'additional_gross_income' => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL13BC::findOrFail($id);
        $record->update([
            'proposal_number'         => $validated['proposal_number']         ?? null,
            'expenses_start_period'   => $validated['expenses_start_period']   ?? null,
            'expenses_end_period'     => $validated['expenses_end_period']     ?? null,
            'total_cost'              => $validated['total_cost']              ?? 0,
            'year_acquisition'        => $validated['year_acquisition']        ?? null,
            'facilities_percentage'   => $validated['facilities_percentage']   ?? 0,
            'additional_gross_income' => $validated['additional_gross_income'] ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL13BC::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
