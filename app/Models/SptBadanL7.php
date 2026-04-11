<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL7 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_7';

    protected $fillable = [
        'id',
        'spt_badan_id',
        'tax_year_part',
        'amount',
        'fourth_year',
        'third_year',
        'second_year',
        'first_year',
        'year_now',
        'current_tax_year',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class);
    }
}
