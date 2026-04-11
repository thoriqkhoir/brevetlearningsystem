<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL3B extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_3_b';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'name',
        'npwp',
        'tax_type',
        'dpp',
        'income_tax',
        'number_of_provement',
        'date_of_provement',
    ];

    protected $casts = [
        'dpp'               => 'integer',
        'income_tax'        => 'integer',
        'date_of_provement' => 'datetime',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
