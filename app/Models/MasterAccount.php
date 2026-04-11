<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterAccount extends Model
{
    protected $table = 'master_accounts';

    protected $guarded = ['created_at', 'updated_at'];

    protected $fillable = [
        'code',
        'category',
        'name',
    ];

    public function sptOpL3A13A1(): HasMany
    {
        return $this->hasMany(SptOpL3A13A1::class, 'account_id');
    }

    public function sptOpL3A13A2(): HasMany
    {
        return $this->hasMany(SptOpL3A13A2::class, 'account_id');
    }
}
