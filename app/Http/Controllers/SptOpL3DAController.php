<?php

namespace App\Http\Controllers;

use App\Models\SptOpL3DA;
use Illuminate\Http\Request;

class SptOpL3DAController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'uuid'],
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'entertainment_date' => ['nullable', 'date'],
            'entertainment_location' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'entertainment_type' => ['nullable', 'string', 'max:255'],
            'entertainment_amount' => ['nullable'],
            'related_party' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['entertainment_amount'] = (int) ($validated['entertainment_amount'] ?? 0);

        SptOpL3DA::create($validated);

        return back()->with('success', 'Berhasil menambah data Lampiran L-3D Bagian A.');
    }

    public function update(Request $request, string $id)
    {
        $item = SptOpL3DA::findOrFail($id);

        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid', 'exists:spt_op,id'],
            'entertainment_date' => ['nullable', 'date'],
            'entertainment_location' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'entertainment_type' => ['nullable', 'string', 'max:255'],
            'entertainment_amount' => ['nullable'],
            'related_party' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['entertainment_amount'] = (int) ($validated['entertainment_amount'] ?? 0);

        $item->update($validated);

        return back()->with('success', 'Berhasil memperbarui data Lampiran L-3D Bagian A.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid'],
        ]);

        SptOpL3DA::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Berhasil menghapus data Lampiran L-3D Bagian A.');
    }
}
