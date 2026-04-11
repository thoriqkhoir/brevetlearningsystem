<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11A4B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11A4BController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                 => ['required', 'uuid', 'exists:spt_badan,id'],
            'address'                      => ['nullable', 'string'],
            'decision_areas_number'        => ['nullable', 'integer'],
            'decision_areas_date'          => ['nullable', 'date'],
            'decision_longer_areas_number' => ['nullable', 'integer'],
            'decision_longer_areas_date'   => ['nullable', 'date'],
            'value_4a'                     => ['nullable', 'integer'],
            'value_4b'                     => ['nullable', 'integer'],
            'value_4c'                     => ['nullable', 'integer'],
            'value_4d'                     => ['nullable', 'integer'],
            'value_4e'                     => ['nullable', 'integer'],
            'value_4f'                     => ['nullable', 'integer'],
            'total'                        => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];

        $record = SptBadanL11A4B::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        $record->address                      = $validated['address']                      ?? null;
        $record->decision_areas_number        = $validated['decision_areas_number']        ?? 0;
        $record->decision_areas_date          = $validated['decision_areas_date']          ?? null;
        $record->decision_longer_areas_number = $validated['decision_longer_areas_number'] ?? 0;
        $record->decision_longer_areas_date   = $validated['decision_longer_areas_date']   ?? null;
        $record->value_4a                     = $validated['value_4a']                     ?? 0;
        $record->value_4b                     = $validated['value_4b']                     ?? 0;
        $record->value_4c                     = $validated['value_4c']                     ?? 0;
        $record->value_4d                     = $validated['value_4d']                     ?? 0;
        $record->value_4e                     = $validated['value_4e']                     ?? 0;
        $record->value_4f                     = $validated['value_4f']                     ?? 0;
        $record->total                        = $validated['total']                        ?? 0;

        $record->save();

        return back();
    }
}
