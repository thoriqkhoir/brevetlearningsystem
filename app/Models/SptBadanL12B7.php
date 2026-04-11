<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SptBadanL12B7 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_7';

    protected $fillable = [
        'spt_badan_id',
        'fixed_asset_type',
        'fixed_asset_location',
        'quantity',
        'fixed_asset_value',
        'fixed_asset_number',
        'fixed_asset_date',
        'document_number',
        'document_date',
    ];
}
