<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Spt extends Model
{
    use HasUuids;

    protected $table = 'spt';

    protected $guarded = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function form()
    {
        return $this->belongsTo(MasterForm::class, 'form_id');
    }

    public function sptInduk()
    {
        return $this->hasOne(SptInduk::class, 'spt_id');
    }

    public function courseResults()
    {
        return $this->hasMany(CourseResult::class);
    }

    public function sptPpn()
    {
        return $this->hasMany(SptPpn::class, 'spt_id');
    }

    public function sptUnifikasi()
    {
        return $this->hasOne(SptUnifikasi::class, 'spt_id');
    }

    public function spt2126()
    {
        return $this->hasOne(Spt2126::class, 'spt_id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'spt_id');
    }

    public function sptOp()
    {
        return $this->hasOne(SptOp::class, 'spt_id');
    }

    public function sptBadan()
    {
        return $this->hasOne(SptBadan::class, 'spt_id');
    }
}
