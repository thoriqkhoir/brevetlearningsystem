<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL11C extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11c';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'name',
        'address',
        'region',
        'currency_code',
        'currency_end_year',
        'principal_debt_start_year',
        'principal_debt_addition',
        'principal_debt_reducer',
        'principal_debt_end_year',
        'start_loan_term',
        'end_loan_term',
        'interest_rate',
        'interest_amount',
        'cost_other',
        'loan_allocation',
    ];

    protected $casts = [
        'currency_end_year'         => 'integer',
        'principal_debt_start_year' => 'integer',
        'principal_debt_addition'   => 'integer',
        'principal_debt_reducer'    => 'integer',
        'principal_debt_end_year'   => 'integer',
        'interest_rate'             => 'decimal:2',
        'interest_amount'           => 'integer',
        'cost_other'                => 'integer',
        'start_loan_term'           => 'datetime',
        'end_loan_term'             => 'datetime',
    ];
}
