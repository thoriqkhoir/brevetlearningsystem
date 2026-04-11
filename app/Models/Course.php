<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function participants()
    {
        return $this->hasMany(CourseUser::class);
    }

    public function modules()
    {
        return $this->hasMany(CourseModule::class);
    }

    public function activeModules()
    {
        return $this->hasMany(CourseModule::class)->where('is_active', true);
    }

    public function courseSchedules()
    {
        return $this->hasMany(CourseSchedule::class, 'course_id')->orderBy('scheduled_at');
    }

    public function courseTests()
    {
        return $this->hasMany(CourseTest::class, 'course_id')->orderBy('created_at', 'asc');
    }
}
