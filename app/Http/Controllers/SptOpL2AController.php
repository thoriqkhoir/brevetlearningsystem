<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\RecalculatesL2ATotals;
use App\Models\SptOpL2A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL2AController extends Controller
{
    use RecalculatesL2ATotals;
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'object_id' => 'required|integer|exists:master_objects,id',
            'tax_withholder_id' => ['required', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'tax_withholder_name' => 'required|string|max:255',
            'dpp' => 'required|integer|min:0',
            'pph_owed' => 'required|integer|min:0',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL2A::create($validated);

        $this->recalculateL2ATotals($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptOpL2A::findOrFail($id);

        $validated = $request->validate([
            'object_id' => 'required|integer|exists:master_objects,id',
            'tax_withholder_id' => ['required', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'tax_withholder_name' => 'required|string|max:255',
            'dpp' => 'required|integer|min:0',
            'pph_owed' => 'required|integer|min:0',
        ]);

        $record->update($validated);

        $this->recalculateL2ATotals($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_2_a,id',
        ]);

        // Get spt_op_id before deletion
        $sptOpId = SptOpL2A::whereIn('id', $validated['ids'])->value('spt_op_id');

        SptOpL2A::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateL2ATotals($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
