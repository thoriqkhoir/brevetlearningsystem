<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11B2A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11B2AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'     => ['required', 'uuid', 'exists:spt_badan,id'],
            'number_id'        => ['required', 'string'],
            'name'             => ['required', 'string'],
            'relationship'     => ['nullable', 'string'],
            'month_balance_1'  => ['nullable', 'integer'],
            'month_balance_2'  => ['nullable', 'integer'],
            'month_balance_3'  => ['nullable', 'integer'],
            'month_balance_4'  => ['nullable', 'integer'],
            'month_balance_5'  => ['nullable', 'integer'],
            'month_balance_6'  => ['nullable', 'integer'],
            'month_balance_7'  => ['nullable', 'integer'],
            'month_balance_8'  => ['nullable', 'integer'],
            'month_balance_9'  => ['nullable', 'integer'],
            'month_balance_10' => ['nullable', 'integer'],
            'month_balance_11' => ['nullable', 'integer'],
            'month_balance_12' => ['nullable', 'integer'],
            'average_balance'  => ['nullable', 'integer'],
        ]);

        SptBadanL11B2A::create([
            'id'               => (string) Str::uuid(),
            'spt_badan_id'     => $validated['spt_badan_id'],
            'number_id'        => $validated['number_id'],
            'name'             => $validated['name'],
            'relationship'     => $validated['relationship']     ?? null,
            'month_balance_1'  => $validated['month_balance_1']  ?? 0,
            'month_balance_2'  => $validated['month_balance_2']  ?? 0,
            'month_balance_3'  => $validated['month_balance_3']  ?? 0,
            'month_balance_4'  => $validated['month_balance_4']  ?? 0,
            'month_balance_5'  => $validated['month_balance_5']  ?? 0,
            'month_balance_6'  => $validated['month_balance_6']  ?? 0,
            'month_balance_7'  => $validated['month_balance_7']  ?? 0,
            'month_balance_8'  => $validated['month_balance_8']  ?? 0,
            'month_balance_9'  => $validated['month_balance_9']  ?? 0,
            'month_balance_10' => $validated['month_balance_10'] ?? 0,
            'month_balance_11' => $validated['month_balance_11'] ?? 0,
            'month_balance_12' => $validated['month_balance_12'] ?? 0,
            'average_balance'  => $validated['average_balance']  ?? 0,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'number_id'        => ['required', 'string'],
            'name'             => ['required', 'string'],
            'relationship'     => ['nullable', 'string'],
            'month_balance_1'  => ['nullable', 'integer'],
            'month_balance_2'  => ['nullable', 'integer'],
            'month_balance_3'  => ['nullable', 'integer'],
            'month_balance_4'  => ['nullable', 'integer'],
            'month_balance_5'  => ['nullable', 'integer'],
            'month_balance_6'  => ['nullable', 'integer'],
            'month_balance_7'  => ['nullable', 'integer'],
            'month_balance_8'  => ['nullable', 'integer'],
            'month_balance_9'  => ['nullable', 'integer'],
            'month_balance_10' => ['nullable', 'integer'],
            'month_balance_11' => ['nullable', 'integer'],
            'month_balance_12' => ['nullable', 'integer'],
            'average_balance'  => ['nullable', 'integer'],
        ]);

        $record = SptBadanL11B2A::findOrFail($id);
        $record->update([
            'number_id'        => $validated['number_id'],
            'name'             => $validated['name'],
            'relationship'     => $validated['relationship']     ?? null,
            'month_balance_1'  => $validated['month_balance_1']  ?? 0,
            'month_balance_2'  => $validated['month_balance_2']  ?? 0,
            'month_balance_3'  => $validated['month_balance_3']  ?? 0,
            'month_balance_4'  => $validated['month_balance_4']  ?? 0,
            'month_balance_5'  => $validated['month_balance_5']  ?? 0,
            'month_balance_6'  => $validated['month_balance_6']  ?? 0,
            'month_balance_7'  => $validated['month_balance_7']  ?? 0,
            'month_balance_8'  => $validated['month_balance_8']  ?? 0,
            'month_balance_9'  => $validated['month_balance_9']  ?? 0,
            'month_balance_10' => $validated['month_balance_10'] ?? 0,
            'month_balance_11' => $validated['month_balance_11'] ?? 0,
            'month_balance_12' => $validated['month_balance_12'] ?? 0,
            'average_balance'  => $validated['average_balance']  ?? 0,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL11B2A::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
