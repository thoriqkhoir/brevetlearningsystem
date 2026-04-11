<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11A4A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11a_4a';
    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'acquisition_value'      => 'integer',
        'depreciation_last_year' => 'integer',
        'depreciation_this_year' => 'integer',
        'depreciation_remaining' => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
