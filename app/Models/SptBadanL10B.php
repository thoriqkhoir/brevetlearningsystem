<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL10B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_10b';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'is_1a' => 'boolean',
        'is_1b' => 'boolean',
        'is_1c' => 'boolean',
        'is_1d' => 'boolean',
        'is_2a' => 'boolean',
        'is_2b' => 'boolean',
        'is_2c' => 'boolean',
        'is_3a' => 'boolean',
        'is_3b' => 'boolean',
        'is_3c' => 'boolean',
        'is_3d' => 'boolean',
        'is_3e' => 'boolean',
        'is_4a' => 'boolean',
        'is_4b' => 'boolean',
        'is_4c' => 'boolean',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
