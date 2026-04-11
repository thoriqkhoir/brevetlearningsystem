<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SptBadanL2B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_2_b';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'name',
        'country',
        'npwp',
        'position',
        'equity_capital_amount',
        'equity_capital_percentage',
        'debt_amount',
        'debt_year',
        'debt_interest',
        'receivables_amount',
        'receivables_year',
        'receivables_interest',
    ];
}
