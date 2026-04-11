<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3A13A1;
use App\Http\Controllers\Traits\RecalculatesL3LabaRugi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SptOpL3A13A1Controller extends Controller
{
    use RecalculatesL3LabaRugi;
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'type' => ['required', Rule::in(['dagang', 'jasa', 'industri'])],
            'rows' => ['nullable', 'array'],
            'rows.*.id' => ['nullable', 'uuid'],
            'rows.*.account_id' => ['required', 'integer', 'exists:master_accounts,id'],
            'rows.*.commercial_value' => ['nullable', 'integer', 'min:0'],
            'rows.*.non_taxable' => ['nullable', 'integer', 'min:0'],
            'rows.*.subject_to_final' => ['nullable', 'integer', 'min:0'],
            'rows.*.non_final' => ['nullable', 'integer', 'min:0'],
            'rows.*.positive_fiscal' => ['nullable', 'integer', 'min:0'],
            'rows.*.negative_fiscal' => ['nullable', 'integer', 'min:0'],
            'rows.*.correction_code' => ['nullable', 'string', 'max:50'],
            'rows.*.fiscal_amount' => ['nullable', 'integer'],
        ]);

        $sptOpId = $validated['spt_op_id'];
        $type = $validated['type'];
        $rows = $validated['rows'] ?? [];

        SptOpL3A13A1::where('spt_op_id', $sptOpId)
            ->where('type', $type)
            ->delete();

        foreach ($rows as $row) {
            SptOpL3A13A1::create([
                'id' => $row['id'] ?? null,
                'spt_op_id' => $sptOpId,
                'account_id' => $row['account_id'],
                'type' => $type,
                'commercial_value' => (int)($row['commercial_value'] ?? 0),
                'non_taxable' => (int)($row['non_taxable'] ?? 0),
                'subject_to_final' => (int)($row['subject_to_final'] ?? 0),
                'non_final' => (int)($row['non_final'] ?? 0),
                'positive_fiscal' => (int)($row['positive_fiscal'] ?? 0),
                'negative_fiscal' => (int)($row['negative_fiscal'] ?? 0),
                'correction_code' => $row['correction_code'] ?? null,
                'fiscal_amount' => (int)($row['fiscal_amount'] ?? 0),
            ]);
        }

        // Recalculate Laba Rugi after syncing rows
        $this->recalculateL3LabaRugi($validated['spt_op_id'], $validated['type']);

        return back(303);
    }
}
