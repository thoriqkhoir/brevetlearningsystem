<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BupotA1 extends Model
{
    use HasUuids;

    protected $table = 'bupot_a1';

    protected $guarded = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function object()
    {
        return $this->belongsTo(MasterObject::class, 'object_id');
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class, 'bupot_a1_id');
    }
}
