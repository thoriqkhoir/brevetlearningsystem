<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL3A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL3AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                  => 'nullable|uuid',
            'spt_badan_id'        => 'required|uuid|exists:spt_badan,id',
            'name'                => 'required|string|max:255',
            'country'             => 'nullable|string|max:255',
            'pph_date'            => 'nullable|date',
            'type_income'         => 'nullable|string|max:255',
            'net_income'          => 'nullable|integer|min:0',
            'pph_amount'          => 'nullable|integer|min:0',
            'pph_currency'        => 'nullable|string|max:50',
            'pph_foreign_amount'  => 'nullable|integer|min:0',
            'tax_credit'          => 'nullable|integer|min:0',
        ]);

        $validated['id']                 = $validated['id'] ?? (string) Str::uuid();
        $validated['net_income']         = $validated['net_income'] ?? 0;
        $validated['pph_amount']         = $validated['pph_amount'] ?? 0;
        $validated['pph_foreign_amount'] = $validated['pph_foreign_amount'] ?? 0;
        $validated['tax_credit']         = $validated['tax_credit'] ?? 0;

        SptBadanL3A::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL3A::findOrFail($id);

        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'country'            => 'nullable|string|max:255',
            'pph_date'           => 'nullable|date',
            'type_income'        => 'nullable|string|max:255',
            'net_income'         => 'nullable|integer|min:0',
            'pph_amount'         => 'nullable|integer|min:0',
            'pph_currency'       => 'nullable|string|max:50',
            'pph_foreign_amount' => 'nullable|integer|min:0',
            'tax_credit'         => 'nullable|integer|min:0',
        ]);

        $validated['net_income']         = $validated['net_income'] ?? 0;
        $validated['pph_amount']         = $validated['pph_amount'] ?? 0;
        $validated['pph_foreign_amount'] = $validated['pph_foreign_amount'] ?? 0;
        $validated['tax_credit']         = $validated['tax_credit'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_3_a,id',
        ]);

        SptBadanL3A::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
