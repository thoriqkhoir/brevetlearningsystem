<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    use HasUuids;

    protected $fillable = [
        'teacher_id',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function tests()
    {
        return $this->hasMany(Test::class, 'question_bank_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'question_bank_id')->orderBy('order_no');
    }
}
