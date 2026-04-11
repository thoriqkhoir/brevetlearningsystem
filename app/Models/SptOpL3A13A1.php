<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptOpL3A13A1 extends Model
{
    use HasUuids;

    protected $table = 'spt_op_l_3a_1_3_a1';

    protected $guarded = ['created_at', 'updated_at'];

    public function sptOp(): BelongsTo
    {
        return $this->belongsTo(SptOp::class, 'spt_op_id');
    }

    public function masterAccount(): BelongsTo
    {
        return $this->belongsTo(MasterAccount::class, 'account_id');
    }
}
