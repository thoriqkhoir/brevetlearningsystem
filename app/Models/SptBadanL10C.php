<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL10C extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_10c';

    protected $guarded = ['created_at', 'updated_at'];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
