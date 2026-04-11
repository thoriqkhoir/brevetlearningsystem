<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL10D extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_10d';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'is_i_a'  => 'boolean',
        'is_i_b'  => 'boolean',
        'is_i_c'  => 'boolean',
        'is_i_d'  => 'boolean',
        'is_i_e'  => 'boolean',
        'is_ii_a' => 'boolean',
        'is_ii_b' => 'boolean',
        'is_ii_c' => 'boolean',
        'is_ii_d' => 'boolean',
        'is_ii_e' => 'boolean',
        'iii_a'   => 'datetime',
        'iii_b'   => 'datetime',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
