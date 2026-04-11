<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaxpayerAddress extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function taxpayerIdentity()
    {
        return $this->belongsTo(TaxpayerIdentity::class);
    }
}
