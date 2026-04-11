<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL14 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_14';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'tax_year',
        'provision_remaining',
        'replanting_form_surfer',
        'year_1',
        'year_2',
        'year_3',
        'year_4',
        'remaining_amount',
        'unreplaced_excess',
        'surplus_year_replanting_period',
    ];
}
