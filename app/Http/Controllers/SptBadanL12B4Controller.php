<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B4;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B4Controller extends Controller
{
    /**
     * Sync IV.a investment form checkboxes.
     * Creates or removes rows so the DB matches the selected options.
     */
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'       => ['required', 'uuid', 'exists:spt_badan,id'],
            'investment_forms'   => ['present', 'array'],
            'investment_forms.*' => ['required', 'string'],
        ]);

        $sptBadanId      = $validated['spt_badan_id'];
        $selectedForms   = $validated['investment_forms'];

        // Delete rows whose form is no longer checked
        SptBadanL12B4::where('spt_badan_id', $sptBadanId)
            ->whereNotIn('investment_form', $selectedForms)
            ->delete();

        // Create rows for newly checked forms
        $existing = SptBadanL12B4::where('spt_badan_id', $sptBadanId)
            ->pluck('investment_form')
            ->toArray();

        foreach ($selectedForms as $form) {
            if (!in_array($form, $existing)) {
                SptBadanL12B4::create([
                    'id'              => (string) Str::uuid(),
                    'spt_badan_id'    => $sptBadanId,
                    'investment_form' => $form,
                ]);
            }
        }

        return back();
    }
}
