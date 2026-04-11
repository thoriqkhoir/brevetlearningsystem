<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterBillingPayment extends Model
{
    protected $table = 'master_billing_payments';
    protected $guarded = ['created_at', 'updated_at'];
    protected $fillable = [
        'id',
        'name',
    ];
}
