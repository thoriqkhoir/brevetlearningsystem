<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class InvoiceItem extends Model
{
    use HasUuids;

    protected $guarded = ['created_at','updated_at'];

    public function invoice(){
        return $this->belongsTo(Invoice::class);
    }
}
