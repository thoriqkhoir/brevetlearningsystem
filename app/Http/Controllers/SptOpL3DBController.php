<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3DB;
use Illuminate\Http\Request;

class SptOpL3DBController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'uuid'],
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'type_of_cost' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable'],
            'notes' => ['nullable', 'string', 'max:255'],
            'income_tax_with_holding' => ['nullable'],
            'with_holding_slip_number' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['amount'] = (int) ($validated['amount'] ?? 0);
        $validated['income_tax_with_holding'] = (int) ($validated['income_tax_with_holding'] ?? 0);

        SptOpL3DB::create($validated);

        return back()->with('success', 'Berhasil menambah data Lampiran L-3D Bagian B.');
    }

    public function update(Request $request, string $id)
    {
        $item = SptOpL3DB::findOrFail($id);

        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'type_of_cost' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable'],
            'notes' => ['nullable', 'string', 'max:255'],
            'income_tax_with_holding' => ['nullable'],
            'with_holding_slip_number' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['amount'] = (int) ($validated['amount'] ?? 0);
        $validated['income_tax_with_holding'] = (int) ($validated['income_tax_with_holding'] ?? 0);

        $item->update($validated);

        return back()->with('success', 'Berhasil memperbarui data Lampiran L-3D Bagian B.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptOpL3DB::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Berhasil menghapus data Lampiran L-3D Bagian B.');
    }
}
