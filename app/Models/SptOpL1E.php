<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptOpL1E extends Model
{
    use HasUuids;

    protected $table = 'spt_op_l_1_e';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'tax_withholder_slip_date' => 'date',
    ];

    public function sptOp(): BelongsTo
    {
        return $this->belongsTo(SptOp::class, 'spt_op_id');
    }
}
