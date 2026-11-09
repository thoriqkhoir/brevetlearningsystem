<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'file_size' => 'integer',
        'version' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function courseSubmission()
    {
        return $this->belongsTo(CourseSubmission::class, 'course_submission_id');
    }

    public function courseTest()
    {
        return $this->belongsTo(CourseTest::class, 'course_test_id');
    }

    public function courseModule()
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function reviews()
    {
        return $this->hasMany(SubmissionReview::class, 'submission_id')->orderBy('created_at', 'desc');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending_review';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}

