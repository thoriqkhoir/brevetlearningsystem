<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B8 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_8';

    protected $fillable = [
        'spt_badan_id',
        'asset_type',
        'asset_value',
        'description',
    ];
}
