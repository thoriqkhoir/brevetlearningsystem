<?php

use App\Http\Controllers\Api\Platform\PlatformCourseController;
use App\Http\Controllers\Api\Platform\PlatformExamResultController;
use App\Http\Controllers\Api\Platform\PlatformProfileController;
use App\Http\Controllers\Api\Platform\PlatformStudentController;
use App\Http\Middleware\EnsureActivePlatform;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/platform')->middleware(['auth:sanctum', EnsureActivePlatform::class])->group(function () {
    Route::get('/profile', [PlatformProfileController::class, 'show'])->name('api.platform.profile');
    Route::get('/students', [PlatformStudentController::class, 'index'])->name('api.platform.students');
    Route::get('/students/{id}', [PlatformStudentController::class, 'show'])->name('api.platform.students.show');
    Route::get('/courses', [PlatformCourseController::class, 'index'])->name('api.platform.courses');
    Route::get('/courses/{id}', [PlatformCourseController::class, 'show'])->name('api.platform.courses.show');
    Route::get('/courses/{id}/students', [PlatformCourseController::class, 'students'])->name('api.platform.courses.students');
    Route::get('/courses/{id}/tests', [PlatformCourseController::class, 'tests'])->name('api.platform.courses.tests');
    Route::get('/exam-results', [PlatformExamResultController::class, 'index'])->name('api.platform.exam_results');
});
