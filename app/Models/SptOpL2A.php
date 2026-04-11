<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptOpL2A extends Model
{
    use HasUuids;

    protected $table = 'spt_op_l_2_a';

    protected $guarded = ['created_at', 'updated_at'];

    public function sptOp(): BelongsTo
    {
        return $this->belongsTo(SptOp::class, 'spt_op_id');
    }

    public function masterObject(): BelongsTo
    {
        return $this->belongsTo(MasterObject::class, 'object_id');
    }
}
