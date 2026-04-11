<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL11A5 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_11a_5';
    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'akrual' => 'integer',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
