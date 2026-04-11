<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL13BA;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13BAController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                  => ['required', 'uuid', 'exists:spt_badan,id'],
            'coorperation_agreement_number' => ['nullable', 'string'],
            'coorperation_agreement_date'   => ['nullable', 'date'],
            'actiity_partner'               => ['nullable', 'string'],
            'note'                          => ['nullable', 'string'],
        ]);

        SptBadanL13BA::create([
            'id'                            => (string) Str::uuid(),
            'spt_badan_id'                  => $validated['spt_badan_id'],
            'coorperation_agreement_number' => $validated['coorperation_agreement_number'] ?? null,
            'coorperation_agreement_date'   => $validated['coorperation_agreement_date']   ?? null,
            'actiity_partner'               => $validated['actiity_partner']               ?? null,
            'note'                          => $validated['note']                          ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'coorperation_agreement_number' => ['nullable', 'string'],
            'coorperation_agreement_date'   => ['nullable', 'date'],
            'actiity_partner'               => ['nullable', 'string'],
            'note'                          => ['nullable', 'string'],
        ]);

        $record = SptBadanL13BA::findOrFail($id);
        $record->update([
            'coorperation_agreement_number' => $validated['coorperation_agreement_number'] ?? null,
            'coorperation_agreement_date'   => $validated['coorperation_agreement_date']   ?? null,
            'actiity_partner'               => $validated['actiity_partner']               ?? null,
            'note'                          => $validated['note']                          ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL13BA::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
