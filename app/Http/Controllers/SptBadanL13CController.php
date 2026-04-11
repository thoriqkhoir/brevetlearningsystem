<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL13C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13CController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                    => ['required', 'uuid', 'exists:spt_badan,id'],
            'grant_facilities_number'         => ['nullable', 'string'],
            'grant_facilities_date'           => ['nullable', 'date'],
            'utilization_facilities_number'   => ['nullable', 'string'],
            'utilization_facilities_date'     => ['nullable', 'date'],
            'facilities_period'               => ['nullable', 'string'],
            'utilization_year'                => ['nullable', 'string'],
            'pph_reducer_percentage'          => ['nullable', 'numeric'],
            'taxable_income'                  => ['nullable', 'numeric'],
            'pph_payable'                     => ['nullable', 'numeric'],
            'facilities_amount'               => ['nullable', 'numeric'],
        ]);

        SptBadanL13C::create([
            'id'                              => (string) Str::uuid(),
            'spt_badan_id'                    => $validated['spt_badan_id'],
            'grant_facilities_number'         => $validated['grant_facilities_number']       ?? null,
            'grant_facilities_date'           => $validated['grant_facilities_date']         ?? null,
            'utilization_facilities_number'   => $validated['utilization_facilities_number'] ?? null,
            'utilization_facilities_date'     => $validated['utilization_facilities_date']   ?? null,
            'facilities_period'               => $validated['facilities_period']             ?? null,
            'utilization_year'                => $validated['utilization_year']              ?? null,
            'pph_reducer_percentage'          => $validated['pph_reducer_percentage']        ?? 0,
            'taxable_income'                  => $validated['taxable_income']                ?? 0,
            'pph_payable'                     => $validated['pph_payable']                   ?? 0,
            'facilities_amount'               => $validated['facilities_amount']             ?? 0,
        ]);

        $this->syncE16Value((string) $validated['spt_badan_id']);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'grant_facilities_number'         => ['nullable', 'string'],
            'grant_facilities_date'           => ['nullable', 'date'],
            'utilization_facilities_number'   => ['nullable', 'string'],
            'utilization_facilities_date'     => ['nullable', 'date'],
            'facilities_period'               => ['nullable', 'string'],
            'utilization_year'                => ['nullable', 'string'],
            'pph_reducer_percentage'          => ['nullable', 'numeric'],
            'taxable_income'                  => ['nullable', 'numeric'],
            'pph_payable'                     => ['nullable', 'numeric'],
            'facilities_amount'               => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL13C::findOrFail($id);
        $record->update([
            'grant_facilities_number'         => $validated['grant_facilities_number']       ?? null,
            'grant_facilities_date'           => $validated['grant_facilities_date']         ?? null,
            'utilization_facilities_number'   => $validated['utilization_facilities_number'] ?? null,
            'utilization_facilities_date'     => $validated['utilization_facilities_date']   ?? null,
            'facilities_period'               => $validated['facilities_period']             ?? null,
            'utilization_year'                => $validated['utilization_year']              ?? null,
            'pph_reducer_percentage'          => $validated['pph_reducer_percentage']        ?? 0,
            'taxable_income'                  => $validated['taxable_income']                ?? 0,
            'pph_payable'                     => $validated['pph_payable']                   ?? 0,
            'facilities_amount'               => $validated['facilities_amount']             ?? 0,
        ]);

        $this->syncE16Value((string) $record->spt_badan_id);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        $sptBadanIds = SptBadanL13C::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL13C::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncE16Value((string) $sptBadanId);
        }

        return back();
    }

    private function syncE16Value(string $sptBadanId): void
    {
        $totalFacilitiesAmount = (int) SptBadanL13C::where('spt_badan_id', $sptBadanId)
            ->sum('facilities_amount');

        SptBadan::where('id', $sptBadanId)->update([
            'e_16' => $totalFacilitiesAmount > 0,
            'e_16_value' => $totalFacilitiesAmount,
        ]);
    }
}
