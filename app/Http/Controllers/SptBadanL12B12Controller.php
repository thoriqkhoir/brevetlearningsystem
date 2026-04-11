<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B12;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B12Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'  => ['required', 'uuid', 'exists:spt_badan,id'],
            'type'          => ['required', 'string'],
            'npwp'          => ['nullable', 'string'],
            'name'          => ['nullable', 'string'],
            'address'       => ['nullable', 'string'],
            'business_type' => ['nullable', 'string'],
        ]);

        SptBadanL12B12::create([
            'id'            => (string) Str::uuid(),
            'spt_badan_id'  => $validated['spt_badan_id'],
            'type'          => $validated['type'],
            'npwp'          => $validated['npwp']          ?? null,
            'name'          => $validated['name']          ?? null,
            'address'       => $validated['address']       ?? null,
            'business_type' => $validated['business_type'] ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'type'          => ['required', 'string'],
            'npwp'          => ['nullable', 'string'],
            'name'          => ['nullable', 'string'],
            'address'       => ['nullable', 'string'],
            'business_type' => ['nullable', 'string'],
        ]);

        $record = SptBadanL12B12::findOrFail($id);
        $record->update([
            'type'          => $validated['type'],
            'npwp'          => $validated['npwp']          ?? null,
            'name'          => $validated['name']          ?? null,
            'address'       => $validated['address']       ?? null,
            'business_type' => $validated['business_type'] ?? null,
        ]);

        return back();
    }
}
