<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL2BTotals;
use App\Models\SptOpL2B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL2BController extends Controller
{
    use RecalculatesL2BTotals;
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'code' => 'required|string|max:255',
            'income_type' => 'nullable|string|max:255',
            'npwp' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'name' => 'nullable|string|max:255',
            'gross_income' => 'required|integer|min:0',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL2B::create($validated);

        $this->recalculateL2BTotals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptOpL2B::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'income_type' => 'nullable|string|max:255',
            'npwp' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'name' => 'nullable|string|max:255',
            'gross_income' => 'required|integer|min:0',
        ]);

        $record->update($validated);

        $this->recalculateL2BTotals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_2_b,id',
        ]);

        // Get spt_op_id before deletion
        $sptOpId = SptOpL2B::whereIn('id', $validated['ids'])->value('spt_op_id');

        SptOpL2B::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL2BTotals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
