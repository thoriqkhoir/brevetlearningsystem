<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B4B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B4BController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_l_12b_4_id' => ['required', 'uuid', 'exists:spt_badan_l_12b_4,id'],
            'investment_name'      => ['nullable', 'string'],
            'realization_value'    => ['nullable', 'integer'],
            'realization_year'     => ['nullable', 'string'],
        ]);

        SptBadanL12B4B::create([
            'id'                   => (string) Str::uuid(),
            'spt_badan_l_12b_4_id' => $validated['spt_badan_l_12b_4_id'],
            'investment_name'      => $validated['investment_name']   ?? null,
            'realization_value'    => $validated['realization_value'] ?? 0,
            'realization_year'     => $validated['realization_year']  ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'investment_name'   => ['nullable', 'string'],
            'realization_value' => ['nullable', 'integer'],
            'realization_year'  => ['nullable', 'string'],
        ]);

        $record = SptBadanL12B4B::findOrFail($id);
        $record->update([
            'investment_name'   => $validated['investment_name']   ?? null,
            'realization_value' => $validated['realization_value'] ?? 0,
            'realization_year'  => $validated['realization_year']  ?? null,
        ]);

        return back();
    }

    public function destroyMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B4B::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
