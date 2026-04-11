<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B5;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B5Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'              => ['required', 'uuid', 'exists:spt_badan,id'],
            'name'                      => ['required', 'string'],
            'npwp'                      => ['required', 'string'],
            'address'                   => ['nullable', 'string'],
            'business_type'             => ['nullable', 'string'],
            'deed_incorporation_number' => ['nullable', 'string'],
            'deed_incorporation_date'   => ['nullable', 'date'],
            'deed_incorporation_notary' => ['nullable', 'string'],
            'investment_value'          => ['nullable', 'integer'],
            'active_period'             => ['nullable', 'string'],
        ]);

        SptBadanL12B5::create([
            'id'                        => (string) Str::uuid(),
            'spt_badan_id'              => $validated['spt_badan_id'],
            'name'                      => $validated['name'],
            'npwp'                      => $validated['npwp'],
            'address'                   => $validated['address']                   ?? null,
            'business_type'             => $validated['business_type']             ?? null,
            'deed_incorporation_number' => $validated['deed_incorporation_number'] ?? null,
            'deed_incorporation_date'   => $validated['deed_incorporation_date']   ?? null,
            'deed_incorporation_notary' => $validated['deed_incorporation_notary'] ?? null,
            'investment_value'          => $validated['investment_value']          ?? 0,
            'active_period'             => $validated['active_period']             ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string'],
            'npwp'                      => ['required', 'string'],
            'address'                   => ['nullable', 'string'],
            'business_type'             => ['nullable', 'string'],
            'deed_incorporation_number' => ['nullable', 'string'],
            'deed_incorporation_date'   => ['nullable', 'date'],
            'deed_incorporation_notary' => ['nullable', 'string'],
            'investment_value'          => ['nullable', 'integer'],
            'active_period'             => ['nullable', 'string'],
        ]);

        $record = SptBadanL12B5::findOrFail($id);
        $record->update([
            'name'                      => $validated['name'],
            'npwp'                      => $validated['npwp'],
            'address'                   => $validated['address']                   ?? null,
            'business_type'             => $validated['business_type']             ?? null,
            'deed_incorporation_number' => $validated['deed_incorporation_number'] ?? null,
            'deed_incorporation_date'   => $validated['deed_incorporation_date']   ?? null,
            'deed_incorporation_notary' => $validated['deed_incorporation_notary'] ?? null,
            'investment_value'          => $validated['investment_value']          ?? 0,
            'active_period'             => $validated['active_period']             ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B5::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
