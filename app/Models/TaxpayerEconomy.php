<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerEconomy extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function taxpayerSourceIncomes()
    {
        return $this->belongsToMany(
            TaxpayerSourceIncome::class,
            'taxpayer_source_income_economy',
            'taxpayer_economy_id',
            'taxpayer_source_income_id'
        )->withTimestamps();
    }
}
