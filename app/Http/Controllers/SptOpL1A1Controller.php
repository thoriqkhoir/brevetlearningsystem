<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL1A7Totals;
use App\Models\SptOpL1A1;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1A1Controller extends Controller
{
    use RecalculatesL1A7Totals;
    /**
     * Store a newly created L1A1 record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'on_behalf' => 'nullable|string|max:255',
            'bank' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'acquisition_year' => 'nullable|string|max:4',
            'integer' => 'nullable|integer',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();
        $validated['integer'] = $validated['integer'] ?? 0;

        SptOpL1A1::create($validated);

        $this->recalculateL1A7Totals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1A1 record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1A1::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'on_behalf' => 'nullable|string|max:255',
            'bank' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'acquisition_year' => 'nullable|string|max:4',
            'integer' => 'nullable|integer',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['integer'] = $validated['integer'] ?? 0;

        $record->update($validated);

        $this->recalculateL1A7Totals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1A1 record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_a1,id',
        ]);

        // Get the spt_op_id before deleting
        $firstRecord = SptOpL1A1::find($validated['ids'][0]);
        $sptOpId = $firstRecord?->spt_op_id;

        SptOpL1A1::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL1A7Totals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
