<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL4B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_4_b';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'code',
        'income_type',
        'source_income',
        'gross_income',
    ];

    protected $casts = [
        'gross_income'  => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
