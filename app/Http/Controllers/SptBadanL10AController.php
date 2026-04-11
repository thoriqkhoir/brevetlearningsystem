<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL10A;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL10AController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                       => 'nullable|uuid',
            'spt_badan_id'             => 'required|uuid|exists:spt_badan,id',
            'name'                     => 'required|string|max:255',
            'npwp'                     => 'required|string|max:255',
            'country'                  => 'nullable|string|max:255',
            'relationship'             => 'nullable|string|max:255',
            'business_activities'      => 'nullable|string|max:255',
            'transaction_type'         => 'nullable|string|max:255',
            'transaction_value'        => 'nullable|integer|min:0',
            'transfer_pricing_method'  => 'nullable|string|max:255',
            'reason_using_method'      => 'nullable|string|max:255',
        ]);

        $validated['id'] = $validated['id'] ?? Str::uuid()->toString();
        $validated['transaction_value'] = $validated['transaction_value'] ?? 0;

        SptBadanL10A::create($validated);

        return back();
    }

    public function update(Request $request, $id)
    {
        $item = SptBadanL10A::findOrFail($id);

        $validated = $request->validate([
            'name'                     => 'required|string|max:255',
            'npwp'                     => 'required|string|max:255',
            'country'                  => 'nullable|string|max:255',
            'relationship'             => 'nullable|string|max:255',
            'business_activities'      => 'nullable|string|max:255',
            'transaction_type'         => 'nullable|string|max:255',
            'transaction_value'        => 'nullable|integer|min:0',
            'transfer_pricing_method'  => 'nullable|string|max:255',
            'reason_using_method'      => 'nullable|string|max:255',
        ]);

        $validated['transaction_value'] = $validated['transaction_value'] ?? 0;

        $item->update($validated);

        return back();
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_10a,id',
        ]);

        SptBadanL10A::whereIn('id', $validated['ids'])->delete();

        return back();
    }
}
