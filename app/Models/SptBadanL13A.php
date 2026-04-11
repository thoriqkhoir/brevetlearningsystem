<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SptBadanL13A extends Model
{
    use HasUuids;

    protected $table = 'spt_badan_l_13a';

    protected $fillable = [
        'spt_badan_id',
        'decision_grant_facilities_number',
        'decision_grant_facilities_date',
        'decision_utilization_facilities_number',
        'decision_utilization_facilities_date',
        'amount_capital_naming_in_foreign',
        'amount_capital_naming_equivalen',
        'amount_capital_naming_in_rupiah',
        'amount_capital_naming_total',
        'capital_naming',
        'field',
        'facilities',
        'reduce_net_income_persentage',
        'additional_period',
        'realization_capital_naming_acumulation',
        'realization_capital_naming_start_production',
        'start_comercial_production',
        'reducer_net_income_year',
        'reducer_net_income_amount',
    ];

    protected $casts = [
        'decision_grant_facilities_date'       => 'datetime',
        'decision_utilization_facilities_date' => 'datetime',
        'reduce_net_income_persentage'          => 'decimal:2',
    ];

    public function sptBadan(): BelongsTo
    {
        return $this->belongsTo(SptBadan::class, 'spt_badan_id');
    }
}
