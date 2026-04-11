<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A5;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A5Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'              => 'nullable|uuid',
            'spt_badan_id'    => 'required|uuid|exists:spt_badan,id',
            'number_id'       => 'required|string|max:255',
            'name'            => 'required|string|max:255',
            'address'         => 'nullable|string|max:255',
            'fiscal_start_year'=> 'nullable|string|max:255',
            'fiscal_end_year' => 'nullable|string|max:255',
            'akrual'          => 'nullable|integer|min:0',
            'category'        => 'nullable|string|max:255',
        ]);

        $validated['id']     = $validated['id'] ?? (string) Str::uuid();
        $validated['akrual'] = $validated['akrual'] ?? 0;

        SptBadanL11A5::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL11A5::findOrFail($id);

        $validated = $request->validate([
            'number_id'        => 'required|string|max:255',
            'name'             => 'required|string|max:255',
            'address'          => 'nullable|string|max:255',
            'fiscal_start_year'=> 'nullable|string|max:255',
            'fiscal_end_year'  => 'nullable|string|max:255',
            'akrual'           => 'nullable|integer|min:0',
            'category'         => 'nullable|string|max:255',
        ]);

        $validated['akrual'] = $validated['akrual'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_11a_5,id',
        ]);

        SptBadanL11A5::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
