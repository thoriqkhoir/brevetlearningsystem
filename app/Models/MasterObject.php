<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterObject extends Model
{
    protected $guarded = ['created_at', 'updated_at'];

    public function sptOpL2A(): HasMany
    {
        return $this->hasMany(SptOpL2A::class, 'object_id');
    }
}
