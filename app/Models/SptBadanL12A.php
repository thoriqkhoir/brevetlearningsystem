<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12a';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'taxable_income',
        'pph_payable',
        'dpp',
        'pph_26_a',
        'pph_26_a_value',
        'pph_26_b',
        'pph_26_b_1',
        'pph_26_b_1_value',
        'pph_26_b_2',
        'pph_26_b_2_a',
        'pph_26_b_2_a_value',
        'pph_26_b_2_b',
        'pph_26_b_2_b_value',
        'pph_26_b_2_c',
        'pph_26_b_2_d',
    ];

    protected $casts = [
        'taxable_income'    => 'integer',
        'pph_payable'       => 'integer',
        'dpp'               => 'integer',
        'pph_26_a'          => 'boolean',
        'pph_26_a_value'    => 'integer',
        'pph_26_b'          => 'boolean',
        'pph_26_b_1'        => 'boolean',
        'pph_26_b_1_value'  => 'integer',
        'pph_26_b_2'        => 'boolean',
        'pph_26_b_2_a'      => 'boolean',
        'pph_26_b_2_b'      => 'boolean',
        'pph_26_b_2_c'      => 'boolean',
        'pph_26_b_2_d'      => 'boolean',
    ];
}
