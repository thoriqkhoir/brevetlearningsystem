<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTestSequence extends Model
{
    protected $fillable = [
        'user_id',
        'test_id',
        'test_type',
        'question_sequence',
        'option_sequences',
    ];

    protected $casts = [
        'question_sequence' => 'array',
        'option_sequences' => 'array',
    ];
}
