<?php

namespace App\Http\Controllers;

use App\Models\BusinessEntity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessEntityController extends Controller
{
    public function index(Request $request)
    {
        $entities = BusinessEntity::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('BusinessEntities/Index', [
            'businessEntities' => $entities,
        ]);
    }

    public function create()
    {
        return Inertia::render('BusinessEntities/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'npwp' => ['required', 'string', 'size:16', 'regex:/^\d{16}$/'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        BusinessEntity::create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return redirect()->route('business-entities.index')->with('success', 'Badan usaha berhasil ditambahkan.');
    }

    public function edit(Request $request, string $id)
    {
        $entity = BusinessEntity::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('BusinessEntities/Edit', [
            'businessEntity' => $entity,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $entity = BusinessEntity::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'npwp' => ['required', 'string', 'size:16', 'regex:/^\d{16}$/'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $entity->update($data);

        return redirect()->route('business-entities.index')->with('success', 'Badan usaha berhasil diperbarui.');
    }

    public function destroy(Request $request, string $id)
    {
        $entity = BusinessEntity::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Jika Anda ingin hard-protect saat masih dipakai SPT, tambahkan pengecekan di sini.
        $entity->delete();

        // Kalau badan yang aktif di session dihapus, reset ke orang pribadi
        if ($request->session()->get('active_business_entity_id') === $id) {
            $request->session()->forget('active_business_entity_id');
        }

        return back();
    }
}
