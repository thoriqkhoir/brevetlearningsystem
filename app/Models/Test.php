<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Test extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'questions_to_show' => 'integer',
    ];

    /**
     * Accessor yang akan otomatis ditambahkan ke JSON
     */
    protected $appends = ['question_count'];

    public function user()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function participants()
    {
        return $this->hasMany(TestUser::class, 'test_id');
    }

    public function testAttempts()
    {
        return $this->hasMany(TestAttempt::class, 'test_id');
    }

    /**
     * Relasi ke Questions
     */
    public function questions()
    {
        return $this->hasMany(Question::class, 'question_bank_id', 'question_bank_id')
            ->whereNotNull('question_bank_id')
            ->orderBy('order_no');
    }

    public function questionBank()
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }

    /**
     * Accessor untuk menghitung jumlah soal
     */
    public function getQuestionCountAttribute()
    {
        return $this->questions()->count();
    }



    /**
     * Scope untuk ujian yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope untuk ujian yang sedang berlangsung
     */
    public function scopeOngoing($query)
    {
        $now = now();
        return $query->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now);
    }
}
