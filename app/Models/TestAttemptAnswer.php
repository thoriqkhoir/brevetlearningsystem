<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TestAttemptAnswer extends Model
{
    use HasUuids;

    protected $fillable = [
        'question_id',
        'test_attempt_id',
        'answer',
        'is_correct',
        'score'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'score' => 'integer',
    ];

    /**
     * Relasi ke Question
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Relasi ke TestAttempt
     */
    public function testAttempt()
    {
        return $this->belongsTo(TestAttempt::class);
    }
}