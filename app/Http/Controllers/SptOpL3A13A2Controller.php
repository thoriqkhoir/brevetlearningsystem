<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3A13A2;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SptOpL3A13A2Controller extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'type' => ['required', Rule::in(['dagang', 'jasa', 'industri'])],
            'rows' => ['nullable', 'array'],
            'rows.*.id' => ['nullable', 'uuid'],
            'rows.*.account_id' => ['required', 'integer', 'exists:master_accounts,id'],
            'rows.*.amount' => ['nullable', 'integer', 'min:0'],
        ]);

        $sptOpId = $validated['spt_op_id'];
        $type = $validated['type'];
        $rows = $validated['rows'] ?? [];

        SptOpL3A13A2::where('spt_op_id', $sptOpId)
            ->where('type', $type)
            ->delete();

        foreach ($rows as $row) {
            SptOpL3A13A2::create([
                'id' => $row['id'] ?? null,
                'spt_op_id' => $sptOpId,
                'account_id' => $row['account_id'],
                'type' => $type,
                'amount' => (int)($row['amount'] ?? 0),
            ]);
        }

        return back(303);
    }
}
