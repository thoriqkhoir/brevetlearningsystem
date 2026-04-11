<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B5 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_5';

    protected $fillable = [
        'spt_badan_id',
        'name',
        'npwp',
        'address',
        'business_type',
        'deed_incorporation_number',
        'deed_incorporation_date',
        'deed_incorporation_notary',
        'investment_value',
        'active_period',
    ];
}
