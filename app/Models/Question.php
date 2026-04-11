<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\QuestionOption;

class Question extends Model
{
    use HasUuids;

    protected $fillable = [
        'question_bank_id',
        'question_text',
        'image_url',
        'question_type',
        'order_no'
    ];

    protected $casts = [
        'order_no' => 'integer',
    ];

    public function questionBank()
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }

    /**
     * Relasi ke QuestionOption (untuk multiple choice)
     */
    public function options()
    {
        return $this->hasMany(QuestionOption::class);
    }

    /**
     * Relasi ke jawaban peserta
     */
    public function answers()
    {
        return $this->hasMany(TestAttemptAnswer::class);
    }

    /**
     * Scope untuk filter berdasarkan tipe soal
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('question_type', $type);
    }

    /**
     * Scope untuk urutan soal
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_no');
    }

    /**
     * Accessor untuk mendapatkan jawaban yang benar pada multiple choice
     */
    public function getCorrectOptionAttribute()
    {
        return $this->options()->where('is_correct', true)->first();
    }

    /**
     * Mutator untuk mengatur order otomatis jika tidak diset
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($question) {
            if (!$question->order_no) {
                $question->order_no =
                    static::where('question_bank_id', $question->question_bank_id)->max('order_no') + 1;
            }
        });
    }
}
