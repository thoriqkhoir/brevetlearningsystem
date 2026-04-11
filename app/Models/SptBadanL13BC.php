<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL13BC extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13b_c';

    protected $fillable = [
        'spt_badan_id',
        'proposal_number',
        'expenses_start_period',
        'expenses_end_period',
        'total_cost',
        'year_acquisition',
        'facilities_percentage',
        'additional_gross_income',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
