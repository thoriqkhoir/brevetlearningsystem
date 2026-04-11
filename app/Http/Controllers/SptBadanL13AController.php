<?php

namespace App\Http\Controllers;

use App\Models\SptBadan;
use App\Models\SptBadanL13A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL13AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spt_badan_id'                                => ['required', 'uuid', 'exists:spt_badan,id'],
            'decision_grant_facilities_number'            => ['nullable', 'string'],
            'decision_grant_facilities_date'              => ['nullable', 'date'],
            'decision_utilization_facilities_number'      => ['nullable', 'string'],
            'decision_utilization_facilities_date'        => ['nullable', 'date'],
            'amount_capital_naming_in_foreign'            => ['nullable', 'numeric'],
            'amount_capital_naming_equivalen'             => ['nullable', 'numeric'],
            'amount_capital_naming_in_rupiah'             => ['nullable', 'numeric'],
            'amount_capital_naming_total'                 => ['nullable', 'numeric'],
            'capital_naming'                              => ['nullable', 'string'],
            'field'                                       => ['nullable', 'string'],
            'facilities'                                  => ['nullable', 'string'],
            'reduce_net_income_persentage'                => ['nullable', 'numeric'],
            'additional_period'                           => ['nullable', 'string'],
            'realization_capital_naming_acumulation'      => ['nullable', 'numeric'],
            'realization_capital_naming_start_production' => ['nullable', 'string'],
            'start_comercial_production'                  => ['nullable', 'string'],
            'reducer_net_income_year'                     => ['nullable', 'string'],
            'reducer_net_income_amount'                   => ['nullable', 'numeric'],
        ]);

        SptBadanL13A::create([
            'id'                                          => (string) Str::uuid(),
            'spt_badan_id'                                => $validated['spt_badan_id'],
            'decision_grant_facilities_number'            => $validated['decision_grant_facilities_number']            ?? null,
            'decision_grant_facilities_date'              => $validated['decision_grant_facilities_date']              ?? null,
            'decision_utilization_facilities_number'      => $validated['decision_utilization_facilities_number']      ?? null,
            'decision_utilization_facilities_date'        => $validated['decision_utilization_facilities_date']        ?? null,
            'amount_capital_naming_in_foreign'            => $validated['amount_capital_naming_in_foreign']            ?? 0,
            'amount_capital_naming_equivalen'             => $validated['amount_capital_naming_equivalen']             ?? 0,
            'amount_capital_naming_in_rupiah'             => $validated['amount_capital_naming_in_rupiah']             ?? 0,
            'amount_capital_naming_total'                 => $validated['amount_capital_naming_total']                 ?? 0,
            'capital_naming'                              => $validated['capital_naming']                              ?? null,
            'field'                                       => $validated['field']                                       ?? null,
            'facilities'                                  => $validated['facilities']                                  ?? null,
            'reduce_net_income_persentage'                => $validated['reduce_net_income_persentage']                ?? 0,
            'additional_period'                           => $validated['additional_period']                           ?? null,
            'realization_capital_naming_acumulation'      => $validated['realization_capital_naming_acumulation']      ?? 0,
            'realization_capital_naming_start_production' => $validated['realization_capital_naming_start_production'] ?? null,
            'start_comercial_production'                  => $validated['start_comercial_production']                  ?? null,
            'reducer_net_income_year'                     => $validated['reducer_net_income_year']                     ?? null,
            'reducer_net_income_amount'                   => $validated['reducer_net_income_amount']                   ?? 0,
        ]);

        $this->syncD5Value((string) $validated['spt_badan_id']);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'decision_grant_facilities_number'            => ['nullable', 'string'],
            'decision_grant_facilities_date'              => ['nullable', 'date'],
            'decision_utilization_facilities_number'      => ['nullable', 'string'],
            'decision_utilization_facilities_date'        => ['nullable', 'date'],
            'amount_capital_naming_in_foreign'            => ['nullable', 'numeric'],
            'amount_capital_naming_equivalen'             => ['nullable', 'numeric'],
            'amount_capital_naming_in_rupiah'             => ['nullable', 'numeric'],
            'amount_capital_naming_total'                 => ['nullable', 'numeric'],
            'capital_naming'                              => ['nullable', 'string'],
            'field'                                       => ['nullable', 'string'],
            'facilities'                                  => ['nullable', 'string'],
            'reduce_net_income_persentage'                => ['nullable', 'numeric'],
            'additional_period'                           => ['nullable', 'string'],
            'realization_capital_naming_acumulation'      => ['nullable', 'numeric'],
            'realization_capital_naming_start_production' => ['nullable', 'string'],
            'start_comercial_production'                  => ['nullable', 'string'],
            'reducer_net_income_year'                     => ['nullable', 'string'],
            'reducer_net_income_amount'                   => ['nullable', 'numeric'],
        ]);

        $record = SptBadanL13A::findOrFail($id);
        $record->update([
            'decision_grant_facilities_number'            => $validated['decision_grant_facilities_number']            ?? null,
            'decision_grant_facilities_date'              => $validated['decision_grant_facilities_date']              ?? null,
            'decision_utilization_facilities_number'      => $validated['decision_utilization_facilities_number']      ?? null,
            'decision_utilization_facilities_date'        => $validated['decision_utilization_facilities_date']        ?? null,
            'amount_capital_naming_in_foreign'            => $validated['amount_capital_naming_in_foreign']            ?? 0,
            'amount_capital_naming_equivalen'             => $validated['amount_capital_naming_equivalen']             ?? 0,
            'amount_capital_naming_in_rupiah'             => $validated['amount_capital_naming_in_rupiah']             ?? 0,
            'amount_capital_naming_total'                 => $validated['amount_capital_naming_total']                 ?? 0,
            'capital_naming'                              => $validated['capital_naming']                              ?? null,
            'field'                                       => $validated['field']                                       ?? null,
            'facilities'                                  => $validated['facilities']                                  ?? null,
            'reduce_net_income_persentage'                => $validated['reduce_net_income_persentage']                ?? 0,
            'additional_period'                           => $validated['additional_period']                           ?? null,
            'realization_capital_naming_acumulation'      => $validated['realization_capital_naming_acumulation']      ?? 0,
            'realization_capital_naming_start_production' => $validated['realization_capital_naming_start_production'] ?? null,
            'start_comercial_production'                  => $validated['start_comercial_production']                  ?? null,
            'reducer_net_income_year'                     => $validated['reducer_net_income_year']                     ?? null,
            'reducer_net_income_amount'                   => $validated['reducer_net_income_amount']                   ?? 0,
        ]);

        $this->syncD5Value((string) $record->spt_badan_id);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'uuid'],
        ]);

        $sptBadanIds = SptBadanL13A::whereIn('id', $validated['ids'])
            ->pluck('spt_badan_id')
            ->filter()
            ->unique()
            ->values();

        SptBadanL13A::whereIn('id', $validated['ids'])->delete();

        foreach ($sptBadanIds as $sptBadanId) {
            $this->syncD5Value((string) $sptBadanId);
        }

        return back();
    }

    private function syncD5Value(string $sptBadanId): void
    {
        $totalReducerNetIncome = (int) SptBadanL13A::where('spt_badan_id', $sptBadanId)
            ->sum('reducer_net_income_amount');

        SptBadan::where('id', $sptBadanId)->update([
            'd_5' => $totalReducerNetIncome > 0,
            'd_5_value' => $totalReducerNetIncome,
        ]);
    }
}
