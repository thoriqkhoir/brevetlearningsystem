<?php

namespace App\Http\Controllers\Api\Platform;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlatformProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $platform = $request->user();

        $totalStudents = User::where('platform_id', $platform->id)
            ->where('role', 'pengguna')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $platform->id,
                'name' => $platform->name,
                'code' => $platform->code,
                'description' => $platform->description,
                'is_active' => $platform->is_active,
                'total_students' => $totalStudents,
                'created_at' => $platform->created_at?->toIso8601String(),
            ],
        ]);
    }
}
