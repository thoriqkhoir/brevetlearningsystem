<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11B2A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11_b_2a';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'month_balance_1'  => 'integer',
        'month_balance_2'  => 'integer',
        'month_balance_3'  => 'integer',
        'month_balance_4'  => 'integer',
        'month_balance_5'  => 'integer',
        'month_balance_6'  => 'integer',
        'month_balance_7'  => 'integer',
        'month_balance_8'  => 'integer',
        'month_balance_9'  => 'integer',
        'month_balance_10' => 'integer',
        'month_balance_11' => 'integer',
        'month_balance_12' => 'integer',
        'average_balance'  => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
