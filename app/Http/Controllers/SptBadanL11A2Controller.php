<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A2;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A2Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'           => 'nullable|uuid',
            'spt_badan_id' => 'required|uuid|exists:spt_badan,id',
            'date'         => 'nullable|date',
            'place'        => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'type'         => 'nullable|string|max:255',
            'amount'       => 'nullable|integer|min:0',
            'name'         => 'required|string|max:255',
            'position'     => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'business_type'=> 'nullable|string|max:255',
            'notes'        => 'nullable|string|max:255',
        ]);

        $validated['id']     = $validated['id'] ?? (string) Str::uuid();
        $validated['amount'] = $validated['amount'] ?? 0;

        SptBadanL11A2::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL11A2::findOrFail($id);

        $validated = $request->validate([
            'date'         => 'nullable|date',
            'place'        => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'type'         => 'nullable|string|max:255',
            'amount'       => 'nullable|integer|min:0',
            'name'         => 'required|string|max:255',
            'position'     => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'business_type'=> 'nullable|string|max:255',
            'notes'        => 'nullable|string|max:255',
        ]);

        $validated['amount'] = $validated['amount'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_11a_2,id',
        ]);

        SptBadanL11A2::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
