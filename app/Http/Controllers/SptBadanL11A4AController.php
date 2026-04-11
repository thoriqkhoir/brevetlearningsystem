<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A4A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A4AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                     => 'nullable|uuid',
            'spt_badan_id'           => 'required|uuid|exists:spt_badan,id',
            'tangible_asset_type'    => 'nullable|string|max:255',
            'acquisition_year'       => 'nullable|string|max:4',
            'acquisition_value'      => 'nullable|integer|min:0',
            'depreciation_last_year' => 'nullable|integer|min:0',
            'depreciation_this_year' => 'nullable|integer|min:0',
            'depreciation_remaining' => 'nullable|integer|min:0',
        ]);

        $validated['id']                     = $validated['id'] ?? (string) Str::uuid();
        $validated['acquisition_value']      = $validated['acquisition_value'] ?? 0;
        $validated['depreciation_last_year'] = $validated['depreciation_last_year'] ?? 0;
        $validated['depreciation_this_year'] = $validated['depreciation_this_year'] ?? 0;
        $validated['depreciation_remaining'] = $validated['depreciation_remaining'] ?? 0;

        SptBadanL11A4A::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL11A4A::findOrFail($id);

        $validated = $request->validate([
            'tangible_asset_type'    => 'nullable|string|max:255',
            'acquisition_year'       => 'nullable|string|max:4',
            'acquisition_value'      => 'nullable|integer|min:0',
            'depreciation_last_year' => 'nullable|integer|min:0',
            'depreciation_this_year' => 'nullable|integer|min:0',
            'depreciation_remaining' => 'nullable|integer|min:0',
        ]);

        $validated['acquisition_value']      = $validated['acquisition_value'] ?? 0;
        $validated['depreciation_last_year'] = $validated['depreciation_last_year'] ?? 0;
        $validated['depreciation_this_year'] = $validated['depreciation_this_year'] ?? 0;
        $validated['depreciation_remaining'] = $validated['depreciation_remaining'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_11a_4a,id',
        ]);

        SptBadanL11A4A::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
