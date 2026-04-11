<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL4A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_4_a';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'npwp',
        'name',
        'tax_object_code',
        'tax_object_name',
        'dpp',
        'rate',
        'pph_payable',
    ];

    protected $casts = [
        'dpp'         => 'integer',
        'rate'        => 'decimal:2',
        'pph_payable' => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
