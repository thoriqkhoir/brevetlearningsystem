<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerSourceIncomeEconomy extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at',];

    public function sourceIncome()
    {
        return $this->belongsTo(TaxpayerSourceIncome::class, 'taxpayer_source_income_id');
    }

    public function economy()
    {
        return $this->belongsTo(TaxpayerEconomy::class, 'taxpayer_economy_id');
    }
}
