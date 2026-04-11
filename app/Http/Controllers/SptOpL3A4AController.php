<?php

namespace App\Http\Controllers;

use App\Models\SptOp;
use App\Models\SptOpL3A4A;
use App\Models\SptOpL3A4B;
use Illuminate\Http\Request;

class SptOpL3A4AController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid'],
            'rows' => ['required', 'array'],
            'rows.*.business_place' => ['nullable', 'string'],
            'rows.*.business_type' => ['nullable', 'string'],
            'rows.*.gross_income' => ['nullable', 'numeric'],
            'rows.*.norma' => ['nullable', 'numeric'],
            'rows.*.net_income' => ['nullable', 'numeric'],
        ]);

        $sptOpId = $validated['spt_op_id'];
        $rows = $validated['rows'];

        SptOpL3A4A::where('spt_op_id', $sptOpId)->delete();

        foreach ($rows as $row) {
            SptOpL3A4A::create([
                'spt_op_id' => $sptOpId,
                'business_place' => $row['business_place'] ?? null,
                'business_type' => $row['business_type'] ?? null,
                'gross_income' => (int) ($row['gross_income'] ?? 0),
                'norma' => (int) ($row['norma'] ?? 0),
                'net_income' => (int) ($row['net_income'] ?? 0),
            ]);
        }

        $this->updateSptOpB1cValue($sptOpId);

        return back()->with('success', 'Lampiran L-3A-4 Bagian A berhasil disimpan.');
    }

    /**
     * Update norma for a specific L3A4A row (auto-save).
     */
    public function updateNorma(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'uuid', 'exists:spt_op_l_3a_4_a,id'],
            'norma' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $record = SptOpL3A4A::findOrFail($validated['id']);
        $norma = (int) $validated['norma'];
        $grossIncome = (int) $record->gross_income;
        $netIncome = (int) round($grossIncome * $norma / 100);

        $record->update([
            'norma' => $norma,
            'net_income' => $netIncome,
        ]);

        // Update b_1c_value on SptOp
        $this->updateSptOpB1cValue($record->spt_op_id);

        return response()->json([
            'success' => true,
            'net_income' => $netIncome,
        ]);
    }

    /**
     * Update B.1c value (penghasilan neto) on SptOp from totals in Lampiran 3A-4 A & B.
     */
    private function updateSptOpB1cValue(string $sptOpId): void
    {
        $totalNetA = (int) SptOpL3A4A::where('spt_op_id', $sptOpId)->sum('net_income');
        $totalNetB = (int) SptOpL3A4B::where('spt_op_id', $sptOpId)->sum('net_income');

        SptOp::where('id', $sptOpId)->update([
            'b_1c_value' => $totalNetA + $totalNetB,
        ]);
    }
}
