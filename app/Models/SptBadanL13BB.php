<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL13BB extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13b_b';

    protected $fillable = [
        'spt_badan_id',
        'amount_1a',
        'amount_1b',
        'amount_1c',
        'amount_1d',
        'amount_1e',
        'amount_2',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
