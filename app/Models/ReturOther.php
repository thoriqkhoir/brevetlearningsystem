<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ReturOther extends Model
{
    use HasUuids;

    protected $table = 'retur_other';

    protected $guarded = ['created_at', 'updated_at'];

    public function other()
    {
        return $this->belongsTo(Other::class);
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class);
    }

    
}
