<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B12 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_1_2';

    protected $fillable = [
        'spt_badan_id',
        'type',
        'npwp',
        'name',
        'address',
        'business_type',
    ];
}
