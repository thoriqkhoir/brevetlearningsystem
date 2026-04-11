<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Retur extends Model
{
    use HasUuids;

    protected $table = 'retur';

    protected $guarded = ['created_at','updated_at'];

    public function invoice(){
        return $this->belongsTo(Invoice::class);
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class);
    }

    
}
