<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Models\CourseTest;
use App\Models\CourseTestAttemptAnswer;

class CourseTestAttempt extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'course_test_id',
        'test_type',
        'score',
        'passed',
        'started_at',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'passed' => 'boolean',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function courseTest()
    {
        return $this->belongsTo(CourseTest::class, 'course_test_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(CourseTestAttemptAnswer::class, 'course_test_attempt_id');
    }
}
