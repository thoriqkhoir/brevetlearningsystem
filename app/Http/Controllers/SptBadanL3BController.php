<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL3B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL3BController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                   => 'nullable|uuid',
            'spt_badan_id'         => 'required|uuid|exists:spt_badan,id',
            'name'                 => 'required|string|max:255',
            'npwp'                 => 'nullable|string|max:255',
            'tax_type'             => 'nullable|string|max:255',
            'dpp'                  => 'nullable|integer|min:0',
            'income_tax'           => 'nullable|integer|min:0',
            'number_of_provement'  => 'nullable|string|max:255',
            'date_of_provement'    => 'nullable|date',
        ]);

        $validated['id']         = $validated['id'] ?? (string) Str::uuid();
        $validated['dpp']        = $validated['dpp'] ?? 0;
        $validated['income_tax'] = $validated['income_tax'] ?? 0;

        SptBadanL3B::create($validated);
        $this->syncE13Value((string) $validated['spt_badan_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL3B::findOrFail($id);

        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'npwp'                => 'nullable|string|max:255',
            'tax_type'            => 'nullable|string|max:255',
            'dpp'                 => 'nullable|integer|min:0',
            'income_tax'          => 'nullable|integer|min:0',
            'number_of_provement' => 'nullable|string|max:255',
            'date_of_provement'   => 'nullable|date',
        ]);

        $validated['dpp']        = $validated['dpp'] ?? 0;
        $validated['income_tax'] = $validated['income_tax'] ?? 0;

        $record->update($validated);
        $this->syncE13Value((string) $record->spt_badan_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_3_b,id',
        ]);

        $sptBadanIds = SptBadanL3B::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL3B::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncE13Value((string) $sptBadanId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    private function syncE13Value(string $sptBadanId): void
    {
        $totalDpp = (int) SptBadanL3B::where('spt_badan_id', $sptBadanId)
            ->sum('dpp');
        $totalIncomeTax = (int) SptBadanL3B::where('spt_badan_id', $sptBadanId)
            ->sum('income_tax');

        $totalKreditPajak = $totalDpp + $totalIncomeTax;

        SptBadan::where('id', $sptBadanId)->update([
            'e_13' => $totalKreditPajak > 0,
            'e_13_value' => $totalKreditPajak,
        ]);
    }
}
