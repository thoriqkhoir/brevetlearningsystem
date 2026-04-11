<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL11C;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL11CController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'              => ['required', 'uuid', 'exists:spt_badan,id'],
            'name'                      => ['required', 'string'],
            'address'                   => ['nullable', 'string'],
            'region'                    => ['nullable', 'string'],
            'currency_code'             => ['nullable', 'string'],
            'currency_end_year'         => ['nullable', 'integer'],
            'principal_debt_start_year' => ['nullable', 'integer'],
            'principal_debt_addition'   => ['nullable', 'integer'],
            'principal_debt_reducer'    => ['nullable', 'integer'],
            'principal_debt_end_year'   => ['nullable', 'integer'],
            'start_loan_term'           => ['nullable', 'date'],
            'end_loan_term'             => ['nullable', 'date'],
            'interest_rate'             => ['nullable', 'numeric'],
            'interest_amount'           => ['nullable', 'integer'],
            'cost_other'                => ['nullable', 'integer'],
            'loan_allocation'           => ['nullable', 'string'],
        ]);

        SptBadanL11C::create([
            'id'                        => (string) Str::uuid(),
            'spt_badan_id'              => $validated['spt_badan_id'],
            'name'                      => $validated['name'],
            'address'                   => $validated['address']                   ?? null,
            'region'                    => $validated['region']                    ?? null,
            'currency_code'             => $validated['currency_code']             ?? null,
            'currency_end_year'         => $validated['currency_end_year']         ?? 0,
            'principal_debt_start_year' => $validated['principal_debt_start_year'] ?? 0,
            'principal_debt_addition'   => $validated['principal_debt_addition']   ?? 0,
            'principal_debt_reducer'    => $validated['principal_debt_reducer']    ?? 0,
            'principal_debt_end_year'   => $validated['principal_debt_end_year']   ?? 0,
            'start_loan_term'           => $validated['start_loan_term']           ?? null,
            'end_loan_term'             => $validated['end_loan_term']             ?? null,
            'interest_rate'             => $validated['interest_rate']             ?? 0,
            'interest_amount'           => $validated['interest_amount']           ?? 0,
            'cost_other'                => $validated['cost_other']                ?? 0,
            'loan_allocation'           => $validated['loan_allocation']           ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string'],
            'address'                   => ['nullable', 'string'],
            'region'                    => ['nullable', 'string'],
            'currency_code'             => ['nullable', 'string'],
            'currency_end_year'         => ['nullable', 'integer'],
            'principal_debt_start_year' => ['nullable', 'integer'],
            'principal_debt_addition'   => ['nullable', 'integer'],
            'principal_debt_reducer'    => ['nullable', 'integer'],
            'principal_debt_end_year'   => ['nullable', 'integer'],
            'start_loan_term'           => ['nullable', 'date'],
            'end_loan_term'             => ['nullable', 'date'],
            'interest_rate'             => ['nullable', 'numeric'],
            'interest_amount'           => ['nullable', 'integer'],
            'cost_other'                => ['nullable', 'integer'],
            'loan_allocation'           => ['nullable', 'string'],
        ]);

        $record = SptBadanL11C::findOrFail($id);
        $record->update([
            'name'                      => $validated['name'],
            'address'                   => $validated['address']                   ?? null,
            'region'                    => $validated['region']                    ?? null,
            'currency_code'             => $validated['currency_code']             ?? null,
            'currency_end_year'         => $validated['currency_end_year']         ?? 0,
            'principal_debt_start_year' => $validated['principal_debt_start_year'] ?? 0,
            'principal_debt_addition'   => $validated['principal_debt_addition']   ?? 0,
            'principal_debt_reducer'    => $validated['principal_debt_reducer']    ?? 0,
            'principal_debt_end_year'   => $validated['principal_debt_end_year']   ?? 0,
            'start_loan_term'           => $validated['start_loan_term']           ?? null,
            'end_loan_term'             => $validated['end_loan_term']             ?? null,
            'interest_rate'             => $validated['interest_rate']             ?? 0,
            'interest_amount'           => $validated['interest_amount']           ?? 0,
            'cost_other'                => $validated['cost_other']                ?? 0,
            'loan_allocation'           => $validated['loan_allocation']           ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL11C::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
