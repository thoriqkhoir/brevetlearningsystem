<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL5A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL5AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'           => 'nullable|uuid',
            'spt_badan_id' => 'required|uuid|exists:spt_badan,id',
            'nitku'        => 'required|string|max:255',
            'tku_name'     => 'required|string|max:255',
            'address'      => 'nullable|string|max:255',
            'village'      => 'nullable|string|max:255',
            'district'     => 'nullable|string|max:255',
            'regency'      => 'nullable|string|max:255',
            'province'     => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        SptBadanL5A::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL5A::findOrFail($id);

        $validated = $request->validate([
            'nitku'    => 'required|string|max:255',
            'tku_name' => 'required|string|max:255',
            'address'  => 'nullable|string|max:255',
            'village'  => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'regency'  => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
        ]);

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_5_a,id',
        ]);

        SptBadanL5A::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
