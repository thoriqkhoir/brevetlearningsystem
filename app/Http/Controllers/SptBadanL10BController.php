<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL10B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL10BController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id' => ['required', 'uuid', 'exists:spt_badan,id'],
            'is_1a' => ['nullable', 'boolean'],
            'is_1b' => ['nullable', 'boolean'],
            'is_1c' => ['nullable', 'boolean'],
            'is_1d' => ['nullable', 'boolean'],
            'is_2a' => ['nullable', 'boolean'],
            'is_2b' => ['nullable', 'boolean'],
            'is_2c' => ['nullable', 'boolean'],
            'is_3a' => ['nullable', 'boolean'],
            'is_3b' => ['nullable', 'boolean'],
            'is_3c' => ['nullable', 'boolean'],
            'is_3d' => ['nullable', 'boolean'],
            'is_3e' => ['nullable', 'boolean'],
            'is_4a' => ['nullable', 'boolean'],
            'is_4b' => ['nullable', 'boolean'],
            'is_4c' => ['nullable', 'boolean'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];

        $record = SptBadanL10B::firstOrNew(['spt_badan_id' => $sptBadanId]);
        if (!$record->exists) {
            $record->id = (string) Str::uuid();
        }

        foreach (['is_1a','is_1b','is_1c','is_1d','is_2a','is_2b','is_2c','is_3a','is_3b','is_3c','is_3d','is_3e','is_4a','is_4b','is_4c'] as $field) {
            $record->$field = isset($validated[$field]) ? (bool) $validated[$field] : null;
        }

        $record->save();

        return back();
    }
}
