<?php

namespace App\Http\Controllers;

use App\Models\SptOp;
use App\Models\SptOpL3A4A;
use App\Models\SptOpL3A4B;
use Illuminate\Http\Request;

class SptOpL3A4BController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid'],
            'rows' => ['required', 'array'],
            'rows.*.code' => ['required', 'string'],
            'rows.*.income_type' => ['nullable', 'string'],
            'rows.*.net_income' => ['nullable', 'numeric'],
        ]);

        $sptOpId = $validated['spt_op_id'];
        $rows = $validated['rows'];

        SptOpL3A4B::where('spt_op_id', $sptOpId)->delete();

        foreach ($rows as $row) {
            SptOpL3A4B::create([
                'spt_op_id' => $sptOpId,
                'code' => (string) ($row['code'] ?? ''),
                'income_type' => $row['income_type'] ?? null,
                'net_income' => (int) ($row['net_income'] ?? 0),
            ]);
        }

        $this->updateSptOpB1cValue($sptOpId);

        return back()->with('success', 'Lampiran L-3A-4 Bagian B berhasil disimpan.');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'spt_op_id' => 'required|uuid',
            'code' => 'required|string',
            'income_type' => 'required|string',
            'net_income' => 'required|numeric',
        ]);
        SptOpL3A4B::create($data);

        $this->updateSptOpB1cValue($data['spt_op_id']);

        return back()->with('success', 'Data berhasil ditambahkan.');
        // return response atau redirect
    }

    public function show($id)
    {
        $item = SptOpL3A4B::findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = SptOpL3A4B::findOrFail($id);

        $rules = [
            'code' => 'required|string',
            'income_type' => 'required|string',
            'net_income' => 'required|numeric',
        ];

        $validated = $request->validate($rules);

        $item->update($validated);

        $this->updateSptOpB1cValue($item->spt_op_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_3a_4_b,id',
        ]);

        $sptOpIds = SptOpL3A4B::whereIn('id', $validated['ids'])
            ->pluck('spt_op_id')
            ->unique()
            ->values();

        SptOpL3A4B::whereIn('id', $validated['ids'])->delete();

        foreach ($sptOpIds as $sptOpId) {
            $this->updateSptOpB1cValue($sptOpId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
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
