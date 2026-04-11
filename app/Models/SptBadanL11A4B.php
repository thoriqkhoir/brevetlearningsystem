<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11A4B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11_a_4b';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'decision_areas_number'        => 'integer',
        'decision_areas_date'          => 'datetime',
        'decision_longer_areas_number' => 'integer',
        'decision_longer_areas_date'   => 'datetime',
        'value_4a'                     => 'integer',
        'value_4b'                     => 'integer',
        'value_4c'                     => 'integer',
        'value_4d'                     => 'integer',
        'value_4e'                     => 'integer',
        'value_4f'                     => 'integer',
        'total'                        => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
