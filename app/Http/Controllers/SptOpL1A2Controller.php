<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL1A7Totals;
use App\Models\SptOpL1A2;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1A2Controller extends Controller
{
    use RecalculatesL1A7Totals;
    /**
     * Store a newly created L1A2 record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'recipient_id' => ['required', 'string', 'regex:/^\d{1,16}$/'],
            'recipient_name' => 'required|string|max:255',
            'amount' => 'nullable|integer',
            'year_begin' => 'nullable|string|max:4',
            'amount_now' => 'nullable|integer',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();
        $validated['amount'] = $validated['amount'] ?? 0;
        $validated['amount_now'] = $validated['amount_now'] ?? 0;

        SptOpL1A2::create($validated);

        $this->recalculateL1A7Totals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1A2 record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1A2::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'recipient_id' => ['required', 'string', 'regex:/^\d{1,16}$/'],
            'recipient_name' => 'required|string|max:255',
            'amount' => 'nullable|integer',
            'year_begin' => 'nullable|string|max:4',
            'amount_now' => 'nullable|integer',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['amount'] = $validated['amount'] ?? 0;
        $validated['amount_now'] = $validated['amount_now'] ?? 0;

        $record->update($validated);

        $this->recalculateL1A7Totals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1A2 record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_a2,id',
        ]);

        // Get the spt_op_id before deleting
        $firstRecord = SptOpL1A2::find($validated['ids'][0]);
        $sptOpId = $firstRecord?->spt_op_id;

        SptOpL1A2::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL1A7Totals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
