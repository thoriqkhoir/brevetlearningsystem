<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL7;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL7Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'           => 'nullable|uuid',
            'spt_badan_id' => 'required|uuid|exists:spt_badan,id',
            'tax_year_part' => 'nullable|string|max:255',
            'amount'        => 'nullable|integer|min:0',
            'fourth_year'   => 'nullable|integer|min:0',
            'third_year'    => 'nullable|integer|min:0',
            'second_year'   => 'nullable|integer|min:0',
            'first_year'    => 'nullable|integer|min:0',
            'year_now'      => 'nullable|integer|min:0',
            'current_tax_year' => 'nullable|integer|min:0',
        ]);

        $validated['id']          = $validated['id'] ?? (string) Str::uuid();
        $validated['amount']      = $validated['amount'] ?? 0;
        $validated['fourth_year'] = $validated['fourth_year'] ?? 0;
        $validated['third_year']  = $validated['third_year'] ?? 0;
        $validated['second_year'] = $validated['second_year'] ?? 0;
        $validated['first_year']  = $validated['first_year'] ?? 0;
        $validated['year_now']    = $validated['year_now'] ?? 0;
        $validated['current_tax_year'] = $validated['current_tax_year'] ?? 0;

        SptBadanL7::create($validated);
        $this->syncD8Value((string) $validated['spt_badan_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL7::findOrFail($id);

        $validated = $request->validate([
            'tax_year_part' => 'nullable|string|max:255',
            'amount'        => 'nullable|integer|min:0',
            'fourth_year'   => 'nullable|integer|min:0',
            'third_year'    => 'nullable|integer|min:0',
            'second_year'   => 'nullable|integer|min:0',
            'first_year'    => 'nullable|integer|min:0',
            'year_now'      => 'nullable|integer|min:0',
            'current_tax_year' => 'nullable|integer|min:0',
        ]);

        $validated['amount']      = $validated['amount'] ?? 0;
        $validated['fourth_year'] = $validated['fourth_year'] ?? 0;
        $validated['third_year']  = $validated['third_year'] ?? 0;
        $validated['second_year'] = $validated['second_year'] ?? 0;
        $validated['first_year']  = $validated['first_year'] ?? 0;
        $validated['year_now']    = $validated['year_now'] ?? 0;
        $validated['current_tax_year'] = $validated['current_tax_year'] ?? 0;

        $record->update($validated);
        $this->syncD8Value((string) $record->spt_badan_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_7,id',
        ]);

        $sptBadanIds = SptBadanL7::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL7::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncD8Value((string) $sptBadanId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    private function syncD8Value(string $sptBadanId): void
    {
        $totalTahunPajakIni = (int) SptBadanL7::where('spt_badan_id', $sptBadanId)
            ->sum('current_tax_year');

        SptBadan::where('id', $sptBadanId)->update([
            'd_8' => $totalTahunPajakIni > 0,
            'd_8_value' => $totalTahunPajakIni,
        ]);
    }
}
