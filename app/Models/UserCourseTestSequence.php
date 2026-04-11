<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CourseTest;

class UserCourseTestSequence extends Model
{
    protected $fillable = [
        'user_id',
        'course_test_id',
        'test_type',
        'question_sequence',
        'option_sequences',
    ];

    protected $casts = [
        'question_sequence' => 'array',
        'option_sequences' => 'array',
    ];

    public function courseTest()
    {
        return $this->belongsTo(CourseTest::class, 'course_test_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
