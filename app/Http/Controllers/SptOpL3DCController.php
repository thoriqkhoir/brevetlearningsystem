<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3DC;
use Illuminate\Http\Request;

class SptOpL3DCController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'uuid'],
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'debtor_name' => ['nullable', 'string', 'max:255'],
            'debtor_address' => ['nullable', 'string', 'max:255'],
            'amount_of_debt' => ['nullable'],
            'bad_debt' => ['nullable'],
            'deduction_method' => ['nullable', 'string', 'max:255'],
            'type_of_proof' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['amount_of_debt'] = (int) ($validated['amount_of_debt'] ?? 0);
        $validated['bad_debt'] = (int) ($validated['bad_debt'] ?? 0);

        SptOpL3DC::create($validated);

        return back()->with('success', 'Berhasil menambah data Lampiran L-3D Bagian C.');
    }

    public function update(Request $request, string $id)
    {
        $item = SptOpL3DC::findOrFail($id);

        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'debtor_name' => ['nullable', 'string', 'max:255'],
            'debtor_address' => ['nullable', 'string', 'max:255'],
            'amount_of_debt' => ['nullable'],
            'bad_debt' => ['nullable'],
            'deduction_method' => ['nullable', 'string', 'max:255'],
            'type_of_proof' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['amount_of_debt'] = (int) ($validated['amount_of_debt'] ?? 0);
        $validated['bad_debt'] = (int) ($validated['bad_debt'] ?? 0);

        $item->update($validated);

        return back()->with('success', 'Berhasil memperbarui data Lampiran L-3D Bagian C.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptOpL3DC::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Berhasil menghapus data Lampiran L-3D Bagian C.');
    }
}
