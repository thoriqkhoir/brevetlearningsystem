<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class CheckAccessRights
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$requiredAccess): mixed
    {
        if (count($requiredAccess) === 1 && str_contains($requiredAccess[0], ',')) {
            $requiredAccess = array_map('trim', explode(',', $requiredAccess[0]));
        }

        $activeCourseId = session('active_course_id');
        $accessRights = [];

        if ($activeCourseId) {
            $course = Course::find($activeCourseId);
            if ($course && $course->access_rights) {
                $accessRights = is_string($course->access_rights)
                    ? json_decode($course->access_rights, true)
                    : $course->access_rights;
            }
        }

        if (!$activeCourseId || !is_array($accessRights)) {
            abort(403, 'Unauthorized');
        }

        $hasAccess = collect($requiredAccess)
            ->map(fn($r) => trim($r))
            ->contains(fn($r) => in_array($r, $accessRights, true));

        if (!$hasAccess) {
            Log::error('ACCESS DENIED', [
                'required_any_of' => $requiredAccess,
                'user_has' => $accessRights
            ]);
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
