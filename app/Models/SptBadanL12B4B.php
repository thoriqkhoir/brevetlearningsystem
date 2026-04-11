<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL12B4B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_4b';

    protected $fillable = [
        'spt_badan_l_12b_4_id',
        'investment_name',
        'realization_value',
        'realization_year',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(SptBadanL12B4::class, 'spt_badan_l_12b_4_id');
    }
}
