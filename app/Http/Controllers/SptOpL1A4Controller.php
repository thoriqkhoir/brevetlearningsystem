<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL1A7Totals;
use App\Models\SptOpL1A4;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1A4Controller extends Controller
{
    use RecalculatesL1A7Totals;
    /**
     * Store a newly created L1A4 record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'police_number' => 'required|string|max:255',
            'ownership' => 'required|string|max:255',
            'owner_id' => ['required', 'string', 'regex:/^\d{1,16}$/'],
            'owner_name' => 'required|string|max:255',
            'acquisition_year' => 'required|string|max:4',
            'acquisition_cost' => 'required|integer|min:0',
            'amount_now' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL1A4::create($validated);

        $this->recalculateL1A7Totals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1A4 record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1A4::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'police_number' => 'required|string|max:255',
            'ownership' => 'required|string|max:255',
            'owner_id' => ['required', 'string', 'regex:/^\d{1,16}$/'],
            'owner_name' => 'required|string|max:255',
            'acquisition_year' => 'required|string|max:4',
            'acquisition_cost' => 'required|integer|min:0',
            'amount_now' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $record->update($validated);

        $this->recalculateL1A7Totals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1A4 record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_a4,id',
        ]);

        // Get the spt_op_id before deleting
        $firstRecord = SptOpL1A4::find($validated['ids'][0]);
        $sptOpId = $firstRecord?->spt_op_id;

        SptOpL1A4::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL1A7Totals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
