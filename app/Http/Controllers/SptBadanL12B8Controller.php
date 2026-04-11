<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B8;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B8Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'asset_type'   => ['required', 'string'],
            'asset_value'  => ['nullable', 'integer'],
            'description'  => ['nullable', 'string'],
        ]);

        SptBadanL12B8::create([
            'id'           => (string) Str::uuid(),
            'spt_badan_id' => $validated['spt_badan_id'],
            'asset_type'   => $validated['asset_type'],
            'asset_value'  => $validated['asset_value'] ?? 0,
            'description'  => $validated['description'] ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'asset_type'  => ['required', 'string'],
            'asset_value' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
        ]);

        $record = SptBadanL12B8::findOrFail($id);
        $record->update([
            'asset_type'  => $validated['asset_type'],
            'asset_value' => $validated['asset_value'] ?? 0,
            'description' => $validated['description'] ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B8::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
