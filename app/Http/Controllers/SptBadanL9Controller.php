<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL9;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL9Controller extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                            => 'nullable|uuid',
            'spt_badan_id'                  => 'required|uuid|exists:spt_badan,id',
            'group_type'                    => 'required|in:1a,1b,1c,1d,1e,2a,2b,3a,3b,3c,3d,3e',
            'treasure_code'                 => 'required|string|max:255',
            'treasure_type'                 => 'required|string|max:255',
            'period_aquisition'             => 'nullable|date',
            'cost_aquisition'               => 'nullable|integer|min:0',
            'residual_value'                => 'nullable|integer|min:0',
            'comercial_depreciation_method' => 'nullable|string|max:255',
            'fiscal_depreciation_method'    => 'nullable|string|max:255',
            'depreciation_this_year'        => 'nullable|integer|min:0',
            'note'                          => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? Str::uuid()->toString();
        $validated['period_aquisition'] = $this->normalizePeriodAquisition(
            $validated['period_aquisition'] ?? null,
        );

        SptBadanL9::create($validated);

        return back();
    }

    public function update(Request $request, $id)
    {
        $item = SptBadanL9::findOrFail($id);

        $validated = $request->validate([
            'group_type'                    => 'required|in:1a,1b,1c,1d,1e,2a,2b,3a,3b,3c,3d,3e',
            'treasure_code'                 => 'required|string|max:255',
            'treasure_type'                 => 'required|string|max:255',
            'period_aquisition'             => 'nullable|date',
            'cost_aquisition'               => 'nullable|integer|min:0',
            'residual_value'                => 'nullable|integer|min:0',
            'comercial_depreciation_method' => 'nullable|string|max:255',
            'fiscal_depreciation_method'    => 'nullable|string|max:255',
            'depreciation_this_year'        => 'nullable|integer|min:0',
            'note'                          => 'nullable|string|max:255',
        ]);

        $validated['period_aquisition'] = $this->normalizePeriodAquisition(
            $validated['period_aquisition'] ?? null,
        );

        $item->update($validated);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_9,id',
        ]);

        SptBadanL9::whereIn('id', $validated['ids'])->delete();

        return back();
    }

    private function normalizePeriodAquisition(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return Carbon::parse($value)->startOfDay()->format('Y-m-d H:i:s');
    }
}
