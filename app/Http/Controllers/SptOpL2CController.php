<?php

namespace App\Http\Controllers;

use App\Models\SptOp;
use App\Models\SptOpL2C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL2CController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'provider_name' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'income_type' => 'required|string|max:255',
            'income_code' => 'required|string|max:255',
            'net_income' => 'required|integer|min:0',
            'tax_foreign_currency' => 'required|integer|min:0',
            'amount' => 'required|integer|min:0',
            'currency' => 'required|string|max:255',
            'tax_credit' => 'required|integer|min:0',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL2C::create($validated);

        $this->updateSptOpB1dValue($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptOpL2C::findOrFail($id);

        $validated = $request->validate([
            'provider_name' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'income_type' => 'required|string|max:255',
            'income_code' => 'required|string|max:255',
            'net_income' => 'required|integer|min:0',
            'tax_foreign_currency' => 'required|integer|min:0',
            'amount' => 'required|integer|min:0',
            'currency' => 'required|string|max:255',
            'tax_credit' => 'required|integer|min:0',
        ]);

        $record->update($validated);

        $this->updateSptOpB1dValue($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_2_c,id',
        ]);

        $sptOpIds = SptOpL2C::whereIn('id', $validated['ids'])
            ->pluck('spt_op_id')
            ->unique()
            ->values();

        SptOpL2C::whereIn('id', $validated['ids'])->delete();

        foreach ($sptOpIds as $sptOpId) {
            $this->updateSptOpB1dValue($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    /**
     * Update B.1d value on SptOp from total net_income (Lampiran 2C).
     */
    private function updateSptOpB1dValue(string $sptOpId): void
    {
        $totalNetIncome = (int) SptOpL2C::where('spt_op_id', $sptOpId)
            ->sum('net_income');

        SptOp::where('id', $sptOpId)->update([
            'b_1d_value' => $totalNetIncome,
        ]);
    }
}
