<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerSourceIncome extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function taxpayerAccounting()
    {
        return $this->belongsTo(TaxpayerAccounting::class);
    }

    public function economies()
    {
        return $this->belongsToMany(
            TaxpayerEconomy::class,
            'taxpayer_source_income_economies',
            'taxpayer_source_income_id',
            'taxpayer_economy_id'
        );
    }
}
