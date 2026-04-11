<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A3;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A3Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                => 'nullable|uuid',
            'spt_badan_id'      => 'required|uuid|exists:spt_badan,id',
            'number_id'         => 'required|string|max:255',
            'name'              => 'required|string|max:255',
            'address'           => 'nullable|string|max:255',
            'receivable_ceiling'=> 'nullable|integer|min:0',
            'bad_debts'         => 'nullable|integer|min:0',
            'loading_method'    => 'nullable|string|max:255',
            'document_method'   => 'nullable|string|max:255',
        ]);

        $validated['id']                = $validated['id'] ?? (string) Str::uuid();
        $validated['receivable_ceiling']= $validated['receivable_ceiling'] ?? 0;
        $validated['bad_debts']         = $validated['bad_debts'] ?? 0;

        SptBadanL11A3::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL11A3::findOrFail($id);

        $validated = $request->validate([
            'number_id'         => 'required|string|max:255',
            'name'              => 'required|string|max:255',
            'address'           => 'nullable|string|max:255',
            'receivable_ceiling'=> 'nullable|integer|min:0',
            'bad_debts'         => 'nullable|integer|min:0',
            'loading_method'    => 'nullable|string|max:255',
            'document_method'   => 'nullable|string|max:255',
        ]);

        $validated['receivable_ceiling'] = $validated['receivable_ceiling'] ?? 0;
        $validated['bad_debts']          = $validated['bad_debts'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_11a_3,id',
        ]);

        SptBadanL11A3::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
