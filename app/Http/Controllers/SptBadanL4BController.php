<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL4B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL4BController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'            => 'nullable|uuid',
            'spt_badan_id'  => 'required|uuid|exists:spt_badan,id',
            'code'          => 'required|string|max:255',
            'income_type'   => 'required|string|max:255',
            'source_income' => 'nullable|string|max:255',
            'gross_income'  => 'nullable|integer|min:0',
        ]);

        $validated['id']            = $validated['id'] ?? (string) Str::uuid();
        $validated['gross_income']  = $validated['gross_income'] ?? 0;

        SptBadanL4B::create($validated);
        $this->syncC3Value((string) $validated['spt_badan_id']);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL4B::findOrFail($id);

        $validated = $request->validate([
            'code'          => 'required|string|max:255',
            'income_type'   => 'required|string|max:255',
            'source_income' => 'nullable|string|max:255',
            'gross_income'  => 'nullable|integer|min:0',
        ]);

        $validated['gross_income']  = $validated['gross_income'] ?? 0;

        $record->update($validated);
        $this->syncC3Value((string) $record->spt_badan_id);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_4_b,id',
        ]);

        $sptBadanIds = SptBadanL4B::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL4B::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncC3Value((string) $sptBadanId);
        }

        return back()->with('success', 'Data berhasil dihapus.');
    }

    private function syncC3Value(string $sptBadanId): void
    {
        $totalGrossIncome = (int) SptBadanL4B::where('spt_badan_id', $sptBadanId)
            ->sum('gross_income');

        SptBadan::where('id', $sptBadanId)->update([
            'c_3' => $totalGrossIncome > 0,
            'c_3_value' => $totalGrossIncome,
        ]);
    }
}
