<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL13BD;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13BDController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'amount_1'     => ['nullable', 'numeric'],
            'amount_2'     => ['nullable', 'numeric'],
            'amount_3'     => ['nullable', 'numeric'],
            'amount_4'     => ['nullable', 'numeric'],
            'amount_5'     => ['nullable', 'numeric'],
            'amount_6'     => ['nullable', 'numeric'],
        ]);

        SptBadanL13BD::create([
            'id'           => (string) Str::uuid(),
            'spt_badan_id' => $validated['spt_badan_id'],
            'amount_1'     => $validated['amount_1'] ?? 0,
            'amount_2'     => $validated['amount_2'] ?? 0,
            'amount_3'     => $validated['amount_3'] ?? 0,
            'amount_4'     => $validated['amount_4'] ?? 0,
            'amount_5'     => $validated['amount_5'] ?? 0,
            'amount_6'     => $validated['amount_6'] ?? 0,
        ]);

        $this->syncD10Value((string) $validated['spt_badan_id']);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'amount_1' => ['nullable', 'numeric'],
            'amount_2' => ['nullable', 'numeric'],
            'amount_3' => ['nullable', 'numeric'],
            'amount_4' => ['nullable', 'numeric'],
            'amount_5' => ['nullable', 'numeric'],
            'amount_6' => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL13BD::findOrFail($id);
        $record->update([
            'amount_1' => $validated['amount_1'] ?? 0,
            'amount_2' => $validated['amount_2'] ?? 0,
            'amount_3' => $validated['amount_3'] ?? 0,
            'amount_4' => $validated['amount_4'] ?? 0,
            'amount_5' => $validated['amount_5'] ?? 0,
            'amount_6' => $validated['amount_6'] ?? 0,
        ]);

        $this->syncD10Value((string) $record->spt_badan_id);

        return back();
    }

    private function syncD10Value(string $sptBadanId): void
    {
        $totalAmount6 = (int) SptBadanL13BD::where('spt_badan_id', $sptBadanId)
            ->sum('amount_6');

        SptBadan::where('id', $sptBadanId)->update([
            'd_10_value' => $totalAmount6,
        ]);
    }
}
