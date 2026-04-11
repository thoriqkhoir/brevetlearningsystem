<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11B3 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11b_3';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'average_debt_balance'       => 'integer',
        'loan_cost'                  => 'integer',
        'loan_cost_tax'              => 'integer',
        'loan_cost_cannot_reduced'   => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
