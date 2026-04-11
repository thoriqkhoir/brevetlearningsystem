<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11B1 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11b_1';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'net_income'            => 'integer',
        'depreciation_expense'  => 'integer',
        'income_tax_expense'    => 'integer',
        'loan_tax_expense'      => 'integer',
        'ebtida'                => 'integer',
        'ebtida_after_tax'      => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
