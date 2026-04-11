<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SptBadanL1B extends Model
{
    protected $fillable = [
        'id',
        'spt_badan_id',
        'account_id',
        'code',
        'amount',
    ];

    protected $table = 'spt_badan_l_1_b';
    protected $keyType = 'string';
    public $incrementing = false;
}
