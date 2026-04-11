<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL1A7Totals;
use App\Models\SptOpL1A6;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class SptOpL1A6Controller extends Controller
{
    use RecalculatesL1A7Totals;
    /**
     * Store a newly created L1A6 record.
     */
    public function store(Request $request)
    {
        $rules = [
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'acquisition_year' => 'required|string|max:4',
            'acquisition_cost' => 'required|integer|min:0',
            'account_number' => 'required|string|max:255',
            'additional_information' => 'required|string|max:255',
            'notes' => 'nullable|string|max:255',
        ];

        if (Schema::hasColumn('spt_op_l_1_a6', 'amount_now')) {
            $rules['amount_now'] = 'required|integer|min:0';
        }

        $validated = $request->validate($rules);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        if (!Schema::hasColumn('spt_op_l_1_a6', 'amount_now')) {
            unset($validated['amount_now']);
        }

        SptOpL1A6::create($validated);

        $this->recalculateL1A7Totals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1A6 record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1A6::findOrFail($id);

        $rules = [
            'code' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'acquisition_year' => 'required|string|max:4',
            'acquisition_cost' => 'required|integer|min:0',
            'account_number' => 'required|string|max:255',
            'additional_information' => 'required|string|max:255',
            'notes' => 'nullable|string|max:255',
        ];

        if (Schema::hasColumn('spt_op_l_1_a6', 'amount_now')) {
            $rules['amount_now'] = 'required|integer|min:0';
        }

        $validated = $request->validate($rules);

        if (!Schema::hasColumn('spt_op_l_1_a6', 'amount_now')) {
            unset($validated['amount_now']);
        }

        $record->update($validated);

        $this->recalculateL1A7Totals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1A6 record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_a6,id',
        ]);

        // Get the spt_op_id before deleting
        $firstRecord = SptOpL1A6::find($validated['ids'][0]);
        $sptOpId = $firstRecord?->spt_op_id;

        SptOpL1A6::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL1A7Totals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
