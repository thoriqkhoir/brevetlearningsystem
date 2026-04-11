<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL5B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL5BController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'           => 'nullable|uuid',
            'spt_badan_id' => 'required|uuid|exists:spt_badan,id',
            'tku_name'     => 'required|string|max:255',
            'january'      => 'nullable|string|max:255',
            'february'     => 'nullable|string|max:255',
            'march'        => 'nullable|string|max:255',
            'april'        => 'nullable|string|max:255',
            'may'          => 'nullable|string|max:255',
            'june'         => 'nullable|string|max:255',
            'july'         => 'nullable|string|max:255',
            'august'       => 'nullable|string|max:255',
            'september'    => 'nullable|string|max:255',
            'october'      => 'nullable|string|max:255',
            'november'     => 'nullable|string|max:255',
            'december'     => 'nullable|string|max:255',
            'total'        => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptBadanL5B::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL5B::findOrFail($id);

        $validated = $request->validate([
            'tku_name'  => 'required|string|max:255',
            'january'   => 'nullable|string|max:255',
            'february'  => 'nullable|string|max:255',
            'march'     => 'nullable|string|max:255',
            'april'     => 'nullable|string|max:255',
            'may'       => 'nullable|string|max:255',
            'june'      => 'nullable|string|max:255',
            'july'      => 'nullable|string|max:255',
            'august'    => 'nullable|string|max:255',
            'september' => 'nullable|string|max:255',
            'october'   => 'nullable|string|max:255',
            'november'  => 'nullable|string|max:255',
            'december'  => 'nullable|string|max:255',
            'total'     => 'nullable|string|max:255',
        ]);

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_5_b,id',
        ]);

        SptBadanL5B::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
