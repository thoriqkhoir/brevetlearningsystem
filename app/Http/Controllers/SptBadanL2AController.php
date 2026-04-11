<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL2A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL2AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                        => 'nullable|uuid',
            'spt_badan_id'              => 'required|uuid|exists:spt_badan,id',
            'name'                      => 'required|string|max:255',
            'address'                   => 'nullable|string|max:255',
            'country'                   => 'nullable|string|max:255',
            'npwp'                      => 'nullable|string|max:255',
            'position'                  => 'required|string|max:255',
            'paid_up_capital_amount'    => 'nullable|integer|min:0',
            'paid_up_capital_percentage'=> 'nullable|numeric|min:0|max:100',
            'dividen'                   => 'nullable|integer|min:0',
        ]);

        $validated['id']                     = $validated['id'] ?? (string) Str::uuid();
        $validated['paid_up_capital_amount'] = $validated['paid_up_capital_amount'] ?? 0;
        $validated['dividen']                = $validated['dividen'] ?? 0;

        SptBadanL2A::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL2A::findOrFail($id);

        $validated = $request->validate([
            'name'                      => 'required|string|max:255',
            'address'                   => 'nullable|string|max:255',
            'country'                   => 'nullable|string|max:255',
            'npwp'                      => 'nullable|string|max:255',
            'position'                  => 'required|string|max:255',
            'paid_up_capital_amount'    => 'nullable|integer|min:0',
            'paid_up_capital_percentage'=> 'nullable|numeric|min:0|max:100',
            'dividen'                   => 'nullable|integer|min:0',
        ]);

        $validated['paid_up_capital_amount'] = $validated['paid_up_capital_amount'] ?? 0;
        $validated['dividen']                = $validated['dividen'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_2_a,id',
        ]);

        SptBadanL2A::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
