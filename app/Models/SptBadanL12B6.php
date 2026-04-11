<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B6 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_6';

    protected $fillable = [
        'spt_badan_id',
        'name',
        'npwp',
        'address',
        'business_type',
        'deed_participation_number',
        'deed_participation_date',
        'deed_participation_notary',
        'investment_value',
        'active_period',
        'is_company_listed',
        'stock_exchange_name',
    ];

    protected $casts = [
        'is_company_listed' => 'boolean',
    ];
}
