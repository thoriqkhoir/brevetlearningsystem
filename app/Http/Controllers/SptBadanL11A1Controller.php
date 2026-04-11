<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A1;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A1Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                   => 'nullable|uuid',
            'spt_badan_id'         => 'required|uuid|exists:spt_badan,id',
            'npwp'                 => 'required|string|max:255',
            'name'                 => 'required|string|max:255',
            'address'              => 'nullable|string|max:255',
            'date'                 => 'nullable|date',
            'cost_type'            => 'nullable|string|max:255',
            'amount'               => 'nullable|integer|min:0',
            'note'                 => 'nullable|string|max:255',
            'pph'                  => 'nullable|integer|min:0',
            'witholding_tax_number'=> 'nullable|string|max:255',
        ]);

        $validated['id']     = $validated['id'] ?? (string) Str::uuid();
        $validated['amount'] = $validated['amount'] ?? 0;
        $validated['pph']    = $validated['pph'] ?? 0;

        SptBadanL11A1::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL11A1::findOrFail($id);

        $validated = $request->validate([
            'npwp'                 => 'required|string|max:255',
            'name'                 => 'required|string|max:255',
            'address'              => 'nullable|string|max:255',
            'date'                 => 'nullable|date',
            'cost_type'            => 'nullable|string|max:255',
            'amount'               => 'nullable|integer|min:0',
            'note'                 => 'nullable|string|max:255',
            'pph'                  => 'nullable|integer|min:0',
            'witholding_tax_number'=> 'nullable|string|max:255',
        ]);

        $validated['amount'] = $validated['amount'] ?? 0;
        $validated['pph']    = $validated['pph'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_11a_1,id',
        ]);

        SptBadanL11A1::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
