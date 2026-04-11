<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL13BB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13BBController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'amount_1a'    => ['nullable', 'numeric'],
            'amount_1b'    => ['nullable', 'numeric'],
            'amount_1c'    => ['nullable', 'numeric'],
            'amount_1d'    => ['nullable', 'numeric'],
            'amount_1e'    => ['nullable', 'numeric'],
            'amount_2'     => ['nullable', 'numeric'],
        ]);

        SptBadanL13BB::create([
            'id'           => (string) Str::uuid(),
            'spt_badan_id' => $validated['spt_badan_id'],
            'amount_1a'    => $validated['amount_1a'] ?? 0,
            'amount_1b'    => $validated['amount_1b'] ?? 0,
            'amount_1c'    => $validated['amount_1c'] ?? 0,
            'amount_1d'    => $validated['amount_1d'] ?? 0,
            'amount_1e'    => $validated['amount_1e'] ?? 0,
            'amount_2'     => $validated['amount_2']  ?? 0,
        ]);

        $this->syncD6Value((string) $validated['spt_badan_id']);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'amount_1a' => ['nullable', 'numeric'],
            'amount_1b' => ['nullable', 'numeric'],
            'amount_1c' => ['nullable', 'numeric'],
            'amount_1d' => ['nullable', 'numeric'],
            'amount_1e' => ['nullable', 'numeric'],
            'amount_2'  => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL13BB::findOrFail($id);
        $record->update([
            'amount_1a' => $validated['amount_1a'] ?? 0,
            'amount_1b' => $validated['amount_1b'] ?? 0,
            'amount_1c' => $validated['amount_1c'] ?? 0,
            'amount_1d' => $validated['amount_1d'] ?? 0,
            'amount_1e' => $validated['amount_1e'] ?? 0,
            'amount_2'  => $validated['amount_2']  ?? 0,
        ]);

        $this->syncD6Value((string) $record->spt_badan_id);

        return back();
    }

    private function syncD6Value(string $sptBadanId): void
    {
        $totalAmount2 = (int) SptBadanL13BB::where('spt_badan_id', $sptBadanId)
            ->sum('amount_2');

        SptBadan::where('id', $sptBadanId)->update([
            'd_6_value' => $totalAmount2,
        ]);
    }
}
