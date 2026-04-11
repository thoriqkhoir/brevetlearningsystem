<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Invoice extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction()
    {
        return $this->belongsTo(MasterTransaction::class, 'transaction_id');
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class);
    }
}
