<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL5B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_5_b';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'tku_name',
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
        'total',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
