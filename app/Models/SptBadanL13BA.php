<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL13BA extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13b_a';

    protected $fillable = [
        'spt_badan_id',
        'coorperation_agreement_number',
        'coorperation_agreement_date',
        'actiity_partner',
        'note',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
