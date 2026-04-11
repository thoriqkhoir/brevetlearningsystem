<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL5A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_5_a';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'nitku',
        'tku_name',
        'address',
        'village',
        'district',
        'regency',
        'province',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
