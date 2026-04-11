<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SptInduk extends Model
{
    use HasUuids;

    protected $table = 'spt_induk';

    protected $guarded = ['created_at','updated_at'];

    public function spt(){
        return $this->belongsTo(Spt::class);
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'spt_id');
    }
}
