<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL1BTotals;
use App\Models\SptOpL1B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1BController extends Controller
{
    use RecalculatesL1BTotals;
    /**
     * Store a newly created L1B record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'creditor_id' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'creditor_name' => 'nullable|string|max:255',
            'creditor_country' => 'nullable|string|max:255',
            'ownership' => 'nullable|string|max:255',
            'loan_year' => 'nullable|string|max:4',
            'balance' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL1B::create($validated);

        $this->recalculateL1BTotals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1B record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1B::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'creditor_id' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'creditor_name' => 'nullable|string|max:255',
            'creditor_country' => 'nullable|string|max:255',
            'ownership' => 'nullable|string|max:255',
            'loan_year' => 'nullable|string|max:4',
            'balance' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $record->update($validated);

        $this->recalculateL1BTotals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1B record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_b,id',
        ]);

        // Get spt_op_id before deletion
        $sptOpId = SptOpL1B::whereIn('id', $validated['ids'])->value('spt_op_id');

        SptOpL1B::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL1BTotals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
