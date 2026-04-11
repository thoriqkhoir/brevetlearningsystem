<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Models\CourseTestAttempt;

class CourseTest extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'questions_to_show' => 'integer',
        'duration' => 'integer',
        'passing_score' => 'integer',
        'show_score' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected $appends = ['question_count'];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function questionBank()
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'question_bank_id', 'question_bank_id')
            ->whereNotNull('question_bank_id')
            ->orderBy('order_no');
    }

    public function attempts()
    {
        return $this->hasMany(CourseTestAttempt::class, 'course_test_id');
    }

    public function getQuestionCountAttribute()
    {
        return $this->questions()->count();
    }
}
