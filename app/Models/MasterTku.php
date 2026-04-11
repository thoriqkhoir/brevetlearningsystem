<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterTku extends Model
{
    protected $table = 'master_tku';

    protected $guarded = ['created_at', 'updated_at'];

    protected $fillable = [
        'name',
    ];

    public function sptOpL3B(): HasMany
    {
        return $this->hasMany(SptOpL3B::class, 'tku_id');
    }
}
