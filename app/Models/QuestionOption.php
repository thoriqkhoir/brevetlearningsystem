<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuestionOption extends Model
{
    use HasUuids;

    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
        'image_url',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /**
     * Relasi ke Question
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Scope untuk jawaban yang benar
     */
    public function scopeCorrect($query)
    {
        return $query->where('is_correct', true);
    }
}