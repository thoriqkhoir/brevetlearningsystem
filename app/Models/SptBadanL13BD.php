<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL13BD extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13b_d';

    protected $fillable = [
        'spt_badan_id',
        'amount_1',
        'amount_2',
        'amount_3',
        'amount_4',
        'amount_5',
        'amount_6',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
