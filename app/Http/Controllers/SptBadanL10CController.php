<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL10C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL10CController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                 => 'nullable|uuid',
            'spt_badan_id'       => 'required|uuid|exists:spt_badan,id',
            'partner_name'       => 'required|string|max:255',
            'transaction_type'   => 'required|string|max:255',
            'country'            => 'nullable|string|max:255',
            'transaction_amount' => 'nullable|integer|min:0',
        ]);

        $validated['id']                 = $validated['id'] ?? (string) Str::uuid();
        $validated['transaction_amount'] = $validated['transaction_amount'] ?? 0;

        SptBadanL10C::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL10C::findOrFail($id);

        $validated = $request->validate([
            'partner_name'       => 'required|string|max:255',
            'transaction_type'   => 'required|string|max:255',
            'country'            => 'nullable|string|max:255',
            'transaction_amount' => 'nullable|integer|min:0',
        ]);

        $validated['transaction_amount'] = $validated['transaction_amount'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_10c,id',
        ]);

        SptBadanL10C::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
