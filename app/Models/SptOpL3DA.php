<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptOpL3DA extends Model
{
    use HasUuids;

    protected $table = 'spt_op_l_3d_a';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'entertainment_date' => 'date',
    ];

    public function sptOp(): BelongsTo
    {
        return $this->belongsTo(SptOp::class, 'spt_op_id');
    }
}
