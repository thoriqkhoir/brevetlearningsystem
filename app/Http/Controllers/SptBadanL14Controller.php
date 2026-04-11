<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL14;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL14Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                  => ['required', 'uuid', 'exists:spt_badan,id'],
            'tax_year'                      => ['nullable', 'string'],
            'provision_remaining'           => ['nullable', 'numeric'],
            'replanting_form_surfer'        => ['nullable', 'string'],
            'year_1'                        => ['nullable', 'numeric'],
            'year_2'                        => ['nullable', 'numeric'],
            'year_3'                        => ['nullable', 'numeric'],
            'year_4'                        => ['nullable', 'numeric'],
            'remaining_amount'              => ['nullable', 'numeric'],
            'unreplaced_excess'             => ['nullable', 'numeric'],
            'surplus_year_replanting_period' => ['nullable', 'numeric'],
        ]);

        SptBadanL14::create([
            'id'                             => (string) Str::uuid(),
            'spt_badan_id'                   => $validated['spt_badan_id'],
            'tax_year'                       => $validated['tax_year']                       ?? null,
            'provision_remaining'            => $validated['provision_remaining']            ?? 0,
            'replanting_form_surfer'         => $validated['replanting_form_surfer']         ?? null,
            'year_1'                         => $validated['year_1']                         ?? 0,
            'year_2'                         => $validated['year_2']                         ?? 0,
            'year_3'                         => $validated['year_3']                         ?? 0,
            'year_4'                         => $validated['year_4']                         ?? 0,
            'remaining_amount'               => $validated['remaining_amount']               ?? 0,
            'unreplaced_excess'              => $validated['unreplaced_excess']              ?? 0,
            'surplus_year_replanting_period' => $validated['surplus_year_replanting_period'] ?? 0,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'tax_year'                       => ['nullable', 'string'],
            'provision_remaining'            => ['nullable', 'numeric'],
            'replanting_form_surfer'         => ['nullable', 'string'],
            'year_1'                         => ['nullable', 'numeric'],
            'year_2'                         => ['nullable', 'numeric'],
            'year_3'                         => ['nullable', 'numeric'],
            'year_4'                         => ['nullable', 'numeric'],
            'remaining_amount'               => ['nullable', 'numeric'],
            'unreplaced_excess'              => ['nullable', 'numeric'],
            'surplus_year_replanting_period' => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL14::findOrFail($id);
        $record->update([
            'tax_year'                       => $validated['tax_year']                       ?? null,
            'provision_remaining'            => $validated['provision_remaining']            ?? 0,
            'replanting_form_surfer'         => $validated['replanting_form_surfer']         ?? null,
            'year_1'                         => $validated['year_1']                         ?? 0,
            'year_2'                         => $validated['year_2']                         ?? 0,
            'year_3'                         => $validated['year_3']                         ?? 0,
            'year_4'                         => $validated['year_4']                         ?? 0,
            'remaining_amount'               => $validated['remaining_amount']               ?? 0,
            'unreplaced_excess'              => $validated['unreplaced_excess']              ?? 0,
            'surplus_year_replanting_period' => $validated['surplus_year_replanting_period'] ?? 0,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL14::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
