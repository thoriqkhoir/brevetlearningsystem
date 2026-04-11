<?php

namespace App\Http\Controllers;

use App\Models\SptBadanL2B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL2BController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id'                        => 'nullable|uuid',
            'spt_badan_id'              => 'required|uuid|exists:spt_badan,id',
            'name'                      => 'required|string|max:255',
            'country'                   => 'nullable|string|max:255',
            'npwp'                      => 'nullable|string|max:255',
            'position'                  => 'nullable|string|max:255',
            'equity_capital_amount'     => 'nullable|integer|min:0',
            'equity_capital_percentage' => 'nullable|numeric|min:0|max:100',
            'debt_amount'               => 'nullable|integer|min:0',
            'debt_year'                 => 'nullable|string|max:10',
            'debt_interest'             => 'nullable|integer|min:0',
            'receivables_amount'        => 'nullable|integer|min:0',
            'receivables_year'          => 'nullable|string|max:10',
            'receivables_interest'      => 'nullable|integer|min:0',
        ]);

        $validated['id']                    = $validated['id'] ?? (string) Str::uuid();
        $validated['equity_capital_amount'] = $validated['equity_capital_amount'] ?? 0;
        $validated['debt_amount']           = $validated['debt_amount'] ?? 0;
        $validated['debt_interest']         = $validated['debt_interest'] ?? 0;
        $validated['receivables_amount']    = $validated['receivables_amount'] ?? 0;
        $validated['receivables_interest']  = $validated['receivables_interest'] ?? 0;

        SptBadanL2B::create($validated);

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, string $id)
    {
        $record = SptBadanL2B::findOrFail($id);

        $validated = $request->validate([
            'name'                      => 'required|string|max:255',
            'country'                   => 'nullable|string|max:255',
            'npwp'                      => 'nullable|string|max:255',
            'position'                  => 'nullable|string|max:255',
            'equity_capital_amount'     => 'nullable|integer|min:0',
            'equity_capital_percentage' => 'nullable|numeric|min:0|max:100',
            'debt_amount'               => 'nullable|integer|min:0',
            'debt_year'                 => 'nullable|string|max:10',
            'debt_interest'             => 'nullable|integer|min:0',
            'receivables_amount'        => 'nullable|integer|min:0',
            'receivables_year'          => 'nullable|string|max:10',
            'receivables_interest'      => 'nullable|integer|min:0',
        ]);

        $validated['equity_capital_amount'] = $validated['equity_capital_amount'] ?? 0;
        $validated['debt_amount']           = $validated['debt_amount'] ?? 0;
        $validated['debt_interest']         = $validated['debt_interest'] ?? 0;
        $validated['receivables_amount']    = $validated['receivables_amount'] ?? 0;
        $validated['receivables_interest']  = $validated['receivables_interest'] ?? 0;

        $record->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'uuid|exists:spt_badan_l_2_b,id',
        ]);

        SptBadanL2B::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }
}
