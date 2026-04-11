<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B7;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B7Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'         => ['required', 'uuid', 'exists:spt_badan,id'],
            'fixed_asset_type'     => ['required', 'string'],
            'fixed_asset_location' => ['required', 'string'],
            'quantity'             => ['nullable', 'integer'],
            'fixed_asset_value'    => ['nullable', 'integer'],
            'fixed_asset_number'   => ['nullable', 'string'],
            'fixed_asset_date'     => ['nullable', 'date'],
            'document_number'      => ['nullable', 'string'],
            'document_date'        => ['nullable', 'date'],
        ]);

        SptBadanL12B7::create([
            'id'                   => (string) Str::uuid(),
            'spt_badan_id'         => $validated['spt_badan_id'],
            'fixed_asset_type'     => $validated['fixed_asset_type'],
            'fixed_asset_location' => $validated['fixed_asset_location'],
            'quantity'             => $validated['quantity']           ?? 0,
            'fixed_asset_value'    => $validated['fixed_asset_value']  ?? 0,
            'fixed_asset_number'   => $validated['fixed_asset_number'] ?? null,
            'fixed_asset_date'     => $validated['fixed_asset_date']   ?? null,
            'document_number'      => $validated['document_number']    ?? null,
            'document_date'        => $validated['document_date']      ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'fixed_asset_type'     => ['required', 'string'],
            'fixed_asset_location' => ['required', 'string'],
            'quantity'             => ['nullable', 'integer'],
            'fixed_asset_value'    => ['nullable', 'integer'],
            'fixed_asset_number'   => ['nullable', 'string'],
            'fixed_asset_date'     => ['nullable', 'date'],
            'document_number'      => ['nullable', 'string'],
            'document_date'        => ['nullable', 'date'],
        ]);

        $record = SptBadanL12B7::findOrFail($id);
        $record->update([
            'fixed_asset_type'     => $validated['fixed_asset_type'],
            'fixed_asset_location' => $validated['fixed_asset_location'],
            'quantity'             => $validated['quantity']           ?? 0,
            'fixed_asset_value'    => $validated['fixed_asset_value']  ?? 0,
            'fixed_asset_number'   => $validated['fixed_asset_number'] ?? null,
            'fixed_asset_date'     => $validated['fixed_asset_date']   ?? null,
            'document_number'      => $validated['document_number']    ?? null,
            'document_date'        => $validated['document_date']      ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B7::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
