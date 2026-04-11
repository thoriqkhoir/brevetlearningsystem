<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterBillingType extends Model
{
    protected $table = 'master_billing_types';
    protected $guarded = ['created_at', 'updated_at'];
    protected $fillable = [
        'id',
        'code',
        'description',
    ];
}
