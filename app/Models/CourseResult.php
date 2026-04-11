<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseResult extends Model
{
    use HasUuids;

    protected $guarded = ['created_at', 'updated_at'];

    public function courseUser()
    {
        return $this->belongsTo(CourseUser::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function retur()
    {
        return $this->belongsTo(Retur::class);
    }

    public function other()
    {
        return $this->belongsTo(Other::class);
    }

    public function returOther()
    {
        return $this->belongsTo(ReturOther::class);
    }

    public function bupot()
    {
        return $this->belongsTo(Bupot::class);
    }

    public function bupotA1()
    {
        return $this->belongsTo(BupotA1::class, 'bupot_a1_id');
    }

    public function bupotA2()
    {
        return $this->belongsTo(BupotA2::class, 'bupot_a2_id');
    }

    public function spt()
    {
        return $this->belongsTo(Spt::class, 'spt_id');
    }

    public function ledger()
    {
        return $this->belongsTo(Ledger::class, 'ledger_id');
    }
    public function billing()
    {
        return $this->belongsTo(Billing::class, 'billing_id');
    }
}
