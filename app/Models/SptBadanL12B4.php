<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SptBadanL12B4 extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_12b_4';

    protected $fillable = [
        'spt_badan_id',
        'investment_form',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SptBadanL12B4B::class, 'spt_badan_l_12b_4_id');
    }
}
