<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL10D;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL10DController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'is_i_a'  => ['nullable', 'boolean'],
            'is_i_b'  => ['nullable', 'boolean'],
            'is_i_c'  => ['nullable', 'boolean'],
            'is_i_d'  => ['nullable', 'boolean'],
            'is_i_e'  => ['nullable', 'boolean'],
            'is_ii_a' => ['nullable', 'boolean'],
            'is_ii_b' => ['nullable', 'boolean'],
            'is_ii_c' => ['nullable', 'boolean'],
            'is_ii_d' => ['nullable', 'boolean'],
            'is_ii_e' => ['nullable', 'boolean'],
            'iii_a'   => ['nullable', 'date'],
            'iii_b'   => ['nullable', 'date'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];

        $record = SptBadanL10D::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        foreach (['is_i_a','is_i_b','is_i_c','is_i_d','is_i_e','is_ii_a','is_ii_b','is_ii_c','is_ii_d','is_ii_e'] as $field) {
            $record->$field = isset($validated[$field]) ? (bool) $validated[$field] : null;
        }

        $record->iii_a = $validated['iii_a'] ?? null;
        $record->iii_b = $validated['iii_b'] ?? null;

        $record->save();

        return back();
    }
}
