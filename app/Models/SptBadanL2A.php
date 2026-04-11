<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SptBadanL2A extends Model
{
    protected $table = 'spt_badan_l_2_a';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'spt_badan_id',
        'name',
        'address',
        'country',
        'npwp',
        'position',
        'paid_up_capital_amount',
        'paid_up_capital_percentage',
        'dividen',
    ];
}
