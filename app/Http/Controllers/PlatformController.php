<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlatformController extends Controller
{
    public function index(Request $request)
    {
        $platformsQuery = Platform::query()
            ->withCount(['users' => function ($q) {
                $q->where('role', 'pengguna');
            }])
            ->with('tokens');

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->value();
            $platformsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $platforms = $platformsQuery->orderByDesc('created_at')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Platform/Index', [
            'platforms' => $platforms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:64|unique:platforms,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $code = !empty($validated['code'])
            ? Str::slug($validated['code'])
            : Str::slug($validated['name']) . '-' . Str::lower(Str::random(5));

        $platform = Platform::create([
            'name' => $validated['name'],
            'code' => $code,
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', "Platform {$platform->name} berhasil ditambahkan.");
    }

    public function update(Request $request, $id)
    {
        $platform = Platform::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:64|unique:platforms,code,' . $platform->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $platform->update([
            'name' => $validated['name'],
            'code' => Str::slug($validated['code']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? $platform->is_active,
        ]);

        return redirect()->back()->with('success', "Platform {$platform->name} berhasil diperbarui.");
    }

    public function toggleStatus($id)
    {
        $platform = Platform::findOrFail($id);
        $platform->is_active = !$platform->is_active;
        $platform->save();

        $status = $platform->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()->with('success', "Platform {$platform->name} berhasil {$status}.");
    }

    public function generateToken(Request $request, $id)
    {
        $platform = Platform::findOrFail($id);

        // Revoke existing tokens if any
        $platform->tokens()->delete();

        $tokenName = $request->input('token_name', 'Platform Access Token');
        $token = $platform->createToken($tokenName, ['platform:read']);

        return redirect()->back()->with([
            'success' => "API Token baru berhasil dibuat untuk {$platform->name}.",
            'plainTextToken' => $token->plainTextToken,
            'platformId' => $platform->id,
        ]);
    }

    public function revokeTokens($id)
    {
        $platform = Platform::findOrFail($id);
        $platform->tokens()->delete();

        return redirect()->back()->with('success', "Seluruh API Token untuk {$platform->name} berhasil dicabut.");
    }

    public function activeList()
    {
        $platforms = Platform::active()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return response()->json($platforms);
    }
}
