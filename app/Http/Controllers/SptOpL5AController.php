<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SptOpL5A;

class SptOpL5AController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid'],
            'rows' => ['required', 'array'],
            'rows.*.tax_year' => ['nullable', 'string'],
            'rows.*.fiscal_amount' => ['nullable', 'integer'],
            'rows.*.compensation_year_a' => ['nullable', 'integer'],
            'rows.*.compensation_year_b' => ['nullable', 'integer'],
            'rows.*.compensation_year_c' => ['nullable', 'integer'],
            'rows.*.compensation_year_d' => ['nullable', 'integer'],
            'rows.*.compensation_year_e' => ['nullable', 'integer'],
            'rows.*.compensation_year_f' => ['nullable', 'integer'],
        ]);

        $sptOpId = $validated['spt_op_id'];
        $rows = $validated['rows'] ?? [];

        SptOpL5A::where('spt_op_id', $sptOpId)->delete();
        foreach ($rows as $row) {
            SptOpL5A::create([
                'spt_op_id' => $sptOpId,
                'tax_year' => (string)($row['tax_year'] ?? ''),
                'fiscal_amount' => (int)($row['fiscal_amount'] ?? 0),
                'compensation_year_a' => (int)($row['compensation_year_a'] ?? 0),
                'compensation_year_b' => (int)($row['compensation_year_b'] ?? 0),
                'compensation_year_c' => (int)($row['compensation_year_c'] ?? 0),
                'compensation_year_d' => (int)($row['compensation_year_d'] ?? 0),
                'compensation_year_e' => (int)($row['compensation_year_e'] ?? 0),
                'compensation_year_f' => (int)($row['compensation_year_f'] ?? 0),
            ]);
        }

        return back();
    }
}
