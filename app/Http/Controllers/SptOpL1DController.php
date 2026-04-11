<?php

namespace App\Http\Controllers;

use App\Models\SptOp;
use App\Models\SptOpL1D;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1DController extends Controller
{
    /**
     * Store a newly created L1D record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'employer_name' => 'required|string|max:255',
            'employer_id' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'gross_income' => 'required|integer|min:0',
            'deduction_gross_income' => 'required|integer|min:0',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        $gross = (int) ($validated['gross_income'] ?? 0);
        $deduction = (int) ($validated['deduction_gross_income'] ?? 0);
        $validated['net_income'] = max(0, $gross - $deduction);

        SptOpL1D::create($validated);
        $this->updateSptOpB1aValue($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1D record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1D::findOrFail($id);

        $validated = $request->validate([
            'employer_name' => 'required|string|max:255',
            'employer_id' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'gross_income' => 'required|integer|min:0',
            'deduction_gross_income' => 'required|integer|min:0',
        ]);

        $gross = (int) ($validated['gross_income'] ?? 0);
        $deduction = (int) ($validated['deduction_gross_income'] ?? 0);
        $validated['net_income'] = max(0, $gross - $deduction);

        $record->update($validated);
        $this->updateSptOpB1aValue($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1D record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_d,id',
        ]);

        $sptOpIds = SptOpL1D::whereIn('id', $validated['ids'])
            ->pluck('spt_op_id')
            ->unique()
            ->values();

        SptOpL1D::whereIn('id', $validated['ids'])->delete();

        foreach ($sptOpIds as $sptOpId) {
            $this->updateSptOpB1aValue($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    private function updateSptOpB1aValue(string $sptOpId): void
    {
        $totalNetIncome = (int) SptOpL1D::where('spt_op_id', $sptOpId)
            ->sum('net_income');

        SptOp::where('id', $sptOpId)->update([
            'b_1a_value' => $totalNetIncome,
        ]);
    }
}
