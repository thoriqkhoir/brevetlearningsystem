<?php

namespace App\Providers;

use App\Models\BusinessEntity;
use App\Models\Course;
use App\Models\Test;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'active_course' => function () {
                $activeCourseId = session('active_course_id');
                return $activeCourseId ? Course::find($activeCourseId) : null;
            },
            'active_test' => function () {
                $activeTestId = session('active_test_id');
                return $activeTestId ? Test::find($activeTestId) : null;
            },
            'business_entities' => function () {
                $user = Auth::user();
                if (!$user) {
                    return [];
                }

                return BusinessEntity::query()
                    ->where('user_id', $user->id)
                    ->orderBy('name')
                    ->get(['id', 'name', 'npwp']);
            },
            'active_business_entity' => function () {
                $activeBusinessEntityId = session('active_business_entity_id');
                if (!$activeBusinessEntityId) {
                    return null;
                }

                $user = Auth::user();
                if (!$user) {
                    return null;
                }

                $entity = BusinessEntity::query()
                    ->where('id', $activeBusinessEntityId)
                    ->where('user_id', $user->id)
                    ->first(['id', 'name', 'npwp']);

                if (!$entity) {
                    session()->forget('active_business_entity_id');
                }

                return $entity;
            },
        ]);
    }
}
