<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TestAttempt extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'test_id',
        'test_type',
        'score',
        'passed',
        'started_at',
        'submitted_at',
        'completed_at'
    ];

    protected $casts = [
        'score' => 'integer',
        'passed' => 'boolean',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function answers()
    {
        return $this->hasMany(TestAttemptAnswer::class);
    }
}