<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL4A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL4AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'              => 'nullable|uuid',
            'spt_badan_id'    => 'required|uuid|exists:spt_badan,id',
            'npwp'            => 'required|string|max:255',
            'name'            => 'required|string|max:255',
            'tax_object_code' => 'nullable|string|max:255',
            'tax_object_name' => 'nullable|string|max:255',
            'dpp'             => 'nullable|integer|min:0',
            'rate'            => 'nullable|numeric|min:0',
            'pph_payable'     => 'nullable|integer|min:0',
        ]);

        $validated['id']          = $validated['id'] ?? (string) Str::uuid();
        $validated['dpp']         = $validated['dpp'] ?? 0;
        $validated['rate']        = $validated['rate'] ?? 0;
        $validated['pph_payable'] = $validated['pph_payable'] ?? 0;

        SptBadanL4A::create($validated);
        $this->syncC2Value((string) $validated['spt_badan_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL4A::findOrFail($id);

        $validated = $request->validate([
            'npwp'            => 'required|string|max:255',
            'name'            => 'required|string|max:255',
            'tax_object_code' => 'nullable|string|max:255',
            'tax_object_name' => 'nullable|string|max:255',
            'dpp'             => 'nullable|integer|min:0',
            'rate'            => 'nullable|numeric|min:0',
            'pph_payable'     => 'nullable|integer|min:0',
        ]);

        $validated['dpp']         = $validated['dpp'] ?? 0;
        $validated['rate']        = $validated['rate'] ?? 0;
        $validated['pph_payable'] = $validated['pph_payable'] ?? 0;

        $record->update($validated);
        $this->syncC2Value((string) $record->spt_badan_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_4_a,id',
        ]);

        $sptBadanIds = SptBadanL4A::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL4A::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncC2Value((string) $sptBadanId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    private function syncC2Value(string $sptBadanId): void
    {
        $totalPphPayable = (int) SptBadanL4A::where('spt_badan_id', $sptBadanId)
            ->sum('dpp');

        SptBadan::where('id', $sptBadanId)->update([
            'c_2' => $totalPphPayable > 0,
            'c_2_value' => $totalPphPayable,
        ]);
    }
}
