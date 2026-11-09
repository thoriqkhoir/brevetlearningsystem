<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSubmission extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'deadline' => 'datetime',
        'file_size' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function courseTests()
    {
        return $this->hasMany(CourseTest::class);
    }
}

