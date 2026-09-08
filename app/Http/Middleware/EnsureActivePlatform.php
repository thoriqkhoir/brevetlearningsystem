<?php

namespace App\Http\Middleware;

use App\Models\Platform;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActivePlatform
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $platform = $request->user();

        if (!$platform instanceof Platform) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated or invalid platform token.',
            ], 401);
        }

        if (!$platform->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Platform is currently inactive. Access denied.',
            ], 403);
        }

        // Check token abilities if required
        if (method_exists($platform, 'currentAccessToken') && $platform->currentAccessToken()) {
            if (!$platform->tokenCan('platform:read') && !$platform->tokenCan('*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token lacks required permissions.',
                ], 403);
            }
        }

        // Attach platform to request for easy access in controllers
        $request->attributes->set('platform', $platform);

        return $next($request);
    }
}
