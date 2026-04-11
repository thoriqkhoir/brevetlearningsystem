<?php

namespace App\Http\Controllers;

use App\Models\SptOpL1C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptOpL1CController extends Controller
{
    /**
     * Store a newly created L1C record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|uuid',
            'spt_op_id' => 'required|uuid|exists:spt_op,id',
            'name' => 'required|string|max:255',
            'nik' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'npwp' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'date_of_birth' => 'nullable|date',
            'relationship' => 'nullable|string|max:255',
            'job' => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? (string) Str::uuid();

        $validated['npwp'] = $validated['npwp'] ?? ($validated['nik'] ?? null);
        unset($validated['nik']);

        SptOpL1C::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Update the specified L1C record.
     */
    public function update(Request $request, string $id)
    {
        $record = SptOpL1C::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'npwp' => ['nullable', 'string', 'max:255', 'regex:/^\d{1,16}$/'],
            'date_of_birth' => 'nullable|date',
            'relationship' => 'nullable|string|max:255',
            'job' => 'nullable|string|max:255',
        ]);

        $validated['npwp'] = $validated['npwp'] ?? ($validated['nik'] ?? null);
        unset($validated['nik']);

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * Remove the specified L1C record(s).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:spt_op_l_1_c,id',
        ]);

        SptOpL1C::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
