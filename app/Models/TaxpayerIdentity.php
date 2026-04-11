<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerIdentity extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function addresses()
    {
        return $this->hasMany(TaxpayerAddress::class);
    }

    public function accountings()
    {
        return $this->hasMany(TaxpayerAccounting::class);
    }
}
