<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL13C extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13c';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'grant_facilities_number',
        'grant_facilities_date',
        'utilization_facilities_number',
        'utilization_facilities_date',
        'facilities_period',
        'utilization_year',
        'pph_reducer_percentage',
        'taxable_income',
        'pph_payable',
        'facilities_amount',
    ];
}
