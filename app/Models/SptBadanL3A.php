<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL3A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_3_a';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'name',
        'country',
        'pph_date',
        'type_income',
        'net_income',
        'pph_amount',
        'pph_currency',
        'pph_foreign_amount',
        'tax_credit',
    ];

    protected $casts = [
        'pph_date'           => 'datetime',
        'net_income'         => 'integer',
        'pph_amount'         => 'integer',
        'pph_foreign_amount' => 'integer',
        'tax_credit'         => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
