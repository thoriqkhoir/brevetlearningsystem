<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerAccounting extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function taxpayerIdentity()
    {
        return $this->belongsTo(TaxpayerIdentity::class);
    }

    public function taxpayerEconomies()
    {
        return $this->hasMany(TaxpayerEconomy::class);
    }

    public function sourceIncomes()
    {
        return $this->hasMany(TaxpayerSourceIncome::class);
    }
}
