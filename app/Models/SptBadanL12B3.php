<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B3 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_3';

    protected $fillable = [
        'spt_badan_id',
        'tax_year',
        'taxable_income',
        'tax_income',
        'income_after_reduce',
    ];
}
