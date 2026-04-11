<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BankController extends Controller
{
    /**
     * Display list of banks (Inertia page)
     */
    public function index()
    {
        $user = Auth::user();
        $banks = Bank::where('user_id', $user->id)
            ->orderBy('is_primary', 'desc')
            ->orderBy('bank_name')
            ->get();

        return Inertia::render('Bank/Index', [
            'banks' => $banks,
        ]);
    }

    /**
     * Show create bank form
     */
    public function create()
    {
        return Inertia::render('Bank/Create');
    }

    /**
     * Show edit bank form
     */
    public function edit($id)
    {
        $user = Auth::user();
        $bank = Bank::where('user_id', $user->id)->findOrFail($id);

        return Inertia::render('Bank/Edit', [
            'bank' => $bank,
        ]);
    }

    /**
     * Get all banks for the authenticated user (API/JSON)
     */
    public function apiIndex()
    {
        $user = Auth::user();
        $banks = Bank::where('user_id', $user->id)
            ->orderBy('is_primary', 'desc')
            ->orderBy('bank_name')
            ->get();

        return response()->json($banks);
    }

    /**
     * Store a new bank account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_type' => 'required|in:tabungan,giro,deposito',
            'is_primary' => 'boolean',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $user = Auth::user();

        // If this bank is set as primary, unset other primary banks
        if ($validated['is_primary'] ?? false) {
            Bank::where('user_id', $user->id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $validated['user_id'] = $user->id;
        Bank::create($validated);

        return redirect()->route('banks')->with('success', 'Bank berhasil ditambahkan');
    }

    /**
     * Update a bank account
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $bank = Bank::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_type' => 'required|in:tabungan,giro,deposito',
            'is_primary' => 'boolean',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // If this bank is set as primary, unset other primary banks
        if ($validated['is_primary'] ?? false) {
            Bank::where('user_id', $user->id)
                ->where('id', '!=', $bank->id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $bank->update($validated);

        return redirect()->route('banks')->with('success', 'Bank berhasil diperbarui');
    }

    /**
     * Delete a bank account
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $bank = Bank::where('user_id', $user->id)->findOrFail($id);
        $bank->delete();

        return redirect()->route('banks')->with('success', 'Bank berhasil dihapus');
    }
}
