<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SptPpn extends Model
{
    use HasUuids;

    protected $table = 'spt_ppn';

    protected $guarded = ['created_at','updated_at'];

    public function spt(){
        return $this->belongsTo(Spt::class);
    }
}
