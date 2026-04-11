<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL12B6;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL12B6Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                => ['required', 'uuid', 'exists:spt_badan,id'],
            'name'                        => ['required', 'string'],
            'npwp'                        => ['required', 'string'],
            'address'                     => ['nullable', 'string'],
            'business_type'               => ['nullable', 'string'],
            'deed_participation_number'   => ['nullable', 'string'],
            'deed_participation_date'     => ['nullable', 'date'],
            'deed_participation_notary'   => ['nullable', 'string'],
            'investment_value'            => ['nullable', 'integer'],
            'active_period'               => ['nullable', 'string'],
            'is_company_listed'           => ['nullable', 'boolean'],
            'stock_exchange_name'         => ['nullable', 'string'],
        ]);

        SptBadanL12B6::create([
            'id'                        => (string) Str::uuid(),
            'spt_badan_id'              => $validated['spt_badan_id'],
            'name'                      => $validated['name'],
            'npwp'                      => $validated['npwp'],
            'address'                   => $validated['address']                   ?? null,
            'business_type'             => $validated['business_type']             ?? null,
            'deed_participation_number' => $validated['deed_participation_number'] ?? null,
            'deed_participation_date'   => $validated['deed_participation_date']   ?? null,
            'deed_participation_notary' => $validated['deed_participation_notary'] ?? null,
            'investment_value'          => $validated['investment_value']          ?? 0,
            'active_period'             => $validated['active_period']             ?? null,
            'is_company_listed'         => $validated['is_company_listed']         ?? false,
            'stock_exchange_name'       => $validated['stock_exchange_name']       ?? null,
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string'],
            'npwp'                      => ['required', 'string'],
            'address'                   => ['nullable', 'string'],
            'business_type'             => ['nullable', 'string'],
            'deed_participation_number' => ['nullable', 'string'],
            'deed_participation_date'   => ['nullable', 'date'],
            'deed_participation_notary' => ['nullable', 'string'],
            'investment_value'          => ['nullable', 'integer'],
            'active_period'             => ['nullable', 'string'],
            'is_company_listed'         => ['nullable', 'boolean'],
            'stock_exchange_name'       => ['nullable', 'string'],
        ]);

        $record = SptBadanL12B6::findOrFail($id);
        $record->update([
            'name'                      => $validated['name'],
            'npwp'                      => $validated['npwp'],
            'address'                   => $validated['address']                   ?? null,
            'business_type'             => $validated['business_type']             ?? null,
            'deed_participation_number' => $validated['deed_participation_number'] ?? null,
            'deed_participation_date'   => $validated['deed_participation_date']   ?? null,
            'deed_participation_notary' => $validated['deed_participation_notary'] ?? null,
            'investment_value'          => $validated['investment_value']          ?? 0,
            'active_period'             => $validated['active_period']             ?? null,
            'is_company_listed'         => $validated['is_company_listed']         ?? false,
            'stock_exchange_name'       => $validated['stock_exchange_name']       ?? null,
        ]);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptBadanL12B6::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
