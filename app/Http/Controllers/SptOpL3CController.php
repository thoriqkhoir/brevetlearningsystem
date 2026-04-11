<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SptOpL3CController extends Controller
{
    /**
     * Store a newly created L3C record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'type' => ['required', Rule::in(['tangible', 'building', 'intangible'])],
            'sub_type' => ['required', Rule::in([
                'kelompok_1',
                'kelompok_2',
                'kelompok_3',
                'kelompok_4',
                'lainnya',
                'permanen',
                'tidak_permanen',
            ])],
            'code' => 'required|string|max:255',
            'asset_type' => 'required|string|max:255',
            'period_acquisition' => 'required|string|max:40',
            'cost_acquisition' => 'nullable|integer|min:0',
            'begining_fiscal_book' => 'nullable|integer|min:0',
            'method_commercial' => 'nullable|string|max:255',
            'method_fiscal' => 'nullable|string|max:255',
            'fiscal_depreciation' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();
        $validated['cost_acquisition'] = (int) ($validated['cost_acquisition'] ?? 0);
        $validated['begining_fiscal_book'] = (int) ($validated['begining_fiscal_book'] ?? 0);
        $validated['fiscal_depreciation'] = (int) ($validated['fiscal_depreciation'] ?? 0);

        SptOpL3C::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L3C record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL3C::findOrFail($id);

        $validated = $request->validate([
            'type' => ['required', Rule::in(['tangible', 'building', 'intangible'])],
            'sub_type' => ['required', Rule::in([
                'kelompok_1',
                'kelompok_2',
                'kelompok_3',
                'kelompok_4',
                'lainnya',
                'permanen',
                'tidak_permanen',
            ])],
            'code' => 'required|string|max:255',
            'asset_type' => 'required|string|max:255',
            'period_acquisition' => 'required|string|max:40',
            'cost_acquisition' => 'nullable|integer|min:0',
            'begining_fiscal_book' => 'nullable|integer|min:0',
            'method_commercial' => 'nullable|string|max:255',
            'method_fiscal' => 'nullable|string|max:255',
            'fiscal_depreciation' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['cost_acquisition'] = (int) ($validated['cost_acquisition'] ?? 0);
        $validated['begining_fiscal_book'] = (int) ($validated['begining_fiscal_book'] ?? 0);
        $validated['fiscal_depreciation'] = (int) ($validated['fiscal_depreciation'] ?? 0);

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L3C record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_3c,id',
        ]);

        SptOpL3C::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
