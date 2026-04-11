<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL1A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_1_a';

    protected $guarded = ['created_at', 'updated_at'];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }

    public function masterAccount(): BelongsTo
    {
        return $this->belongsTo(MasterAccount::class, 'account_id');
    }
}

