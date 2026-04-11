<?php

namespace App\Http\Controllers;

use App\Models\SptOpL1E;
use App\Models\SptOp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SptOpL1EController extends Controller
{
    /**
     * Store a newly created L1E record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'tax_withholder_name' => 'required|string|max:255',
            'tax_withholder_id' => ['required', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'tax_withholder_slip_number' => 'required|string|max:255',
            'tax_withholder_slip_date' => 'required|date',
            'tax_type' => [
                'required',
                'string',
                'max:255',
                Rule::in([
                    'PPh Pasal 15',
                    'PPh Pasal 21',
                    'PPh Pasal 22',
                    'PPh Pasal 23',
                    'PPh Pasal 26',
                    'PPh Ditanggung Pemerintah',
                    'PPh Ditanggung Pemerintah(Proyek Bantuan Luar Negeri)',
                    'Sisa LB yang tidak dikembalikan pada SKPPKP',
                ]),
            ],
            'gross_income' => 'required|integer|min:0',
            'amount' => 'required|integer|min:0',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptOpL1E::create($validated);

        $this->recalculateSptOpL1E($validated['spt_op_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1E record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1E::findOrFail($id);

        $validated = $request->validate([
            'tax_withholder_name' => 'required|string|max:255',
            'tax_withholder_id' => ['required', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'tax_withholder_slip_number' => 'required|string|max:255',
            'tax_withholder_slip_date' => 'required|date',
            'tax_type' => [
                'required',
                'string',
                'max:255',
                Rule::in([
                    'PPh Pasal 15',
                    'PPh Pasal 21',
                    'PPh Pasal 22',
                    'PPh Pasal 23',
                    'PPh Pasal 26',
                    'PPh Ditanggung Pemerintah',
                    'PPh Ditanggung Pemerintah(Proyek Bantuan Luar Negeri)',
                    'Sisa LB yang tidak dikembalikan pada SKPPKP',
                ]),
            ],
            'gross_income' => 'required|integer|min:0',
            'amount' => 'required|integer|min:0',
        ]);

        $record->update($validated);

        $this->recalculateSptOpL1E($record->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1E record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_e,id',
        ]);

        // Get the spt_op_id from the first record before deleting
        $firstRecord = SptOpL1E::find($validated['ids'][0]);
        $sptOpId = $firstRecord?->spt_op_id;

        SptOpL1E::whereIn('id', $validated['ids'])->delete();

        if ($sptOpId) {
            $this->recalculateSptOpL1E($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    /**
     * Recalculate SPT OP d_10_a_value from all L1E "amount" values.
     * Also sets d_10_a to true if there are any L1E entries.
     */
    private function recalculateSptOpL1E(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Sum all L1E "amount" (PPh yang dipotong/dipungut)
        $totalAmount = (int) SptOpL1E::where('spt_op_id', $sptOpId)
            ->sum('amount');

        // Keep d_10_a true if it already was, or set true if there are entries
        $shouldKeepD10A = $totalAmount > 0 ? true : (bool) $sptOp->d_10_a;

        $sptOp->update([
            'd_10_a' => $shouldKeepD10A,
            'd_10_a_value' => $totalAmount,
        ]);
    }
}
