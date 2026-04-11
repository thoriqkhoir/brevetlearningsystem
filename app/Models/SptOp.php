<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SptOp extends Model
{
    use HasUuids;

    protected $table = 'spt_op';

    protected $guarded = ['created_at', 'updated_at'];

    protected $casts = [
        'source_incomes' => 'array',
        'b_1a' => 'boolean',
        'b_1b_1' => 'boolean',
        'b_1c' => 'boolean',
        'b_1d' => 'boolean',
        'c_3' => 'boolean',
        'c_5' => 'string',
        'c_8' => 'boolean',
        'd_10_a' => 'boolean',
        'd_10_d' => 'boolean',
        'e_11_b' => 'boolean',
        'h_13_a' => 'boolean',
        'h_13_b' => 'boolean',
        'h_13_c' => 'boolean',
        'i_14_b' => 'boolean',
        'i_14_c' => 'boolean',
        'i_14_d' => 'boolean',
        'i_14_e' => 'boolean',
        'i_14_f' => 'boolean',
        'i_14_g' => 'boolean',
        'j_a' => 'boolean',
        'j_b' => 'boolean',
        'j_c' => 'boolean',
        'j_d' => 'boolean',
        'j_e' => 'boolean',
    ];

    public function spt(): BelongsTo
    {
        return $this->belongsTo(Spt::class, 'spt_id');
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class, 'bank_id');
    }

    // Lampiran 1
    public function sptOpL1A1(): HasMany
    {
        return $this->hasMany(SptOpL1A1::class, 'spt_op_id');
    }

    public function sptOpL1A2(): HasMany
    {
        return $this->hasMany(SptOpL1A2::class, 'spt_op_id');
    }

    public function sptOpL1A3(): HasMany
    {
        return $this->hasMany(SptOpL1A3::class, 'spt_op_id');
    }

    public function sptOpL1A4(): HasMany
    {
        return $this->hasMany(SptOpL1A4::class, 'spt_op_id');
    }

    public function sptOpL1A5(): HasMany
    {
        return $this->hasMany(SptOpL1A5::class, 'spt_op_id');
    }

    public function sptOpL1A6(): HasMany
    {
        return $this->hasMany(SptOpL1A6::class, 'spt_op_id');
    }

    public function sptOpL1A7(): HasMany
    {
        return $this->hasMany(SptOpL1A7::class, 'spt_op_id');
    }

    public function sptOpL1B(): HasMany
    {
        return $this->hasMany(SptOpL1B::class, 'spt_op_id');
    }

    public function sptOpL1C(): HasMany
    {
        return $this->hasMany(SptOpL1C::class, 'spt_op_id');
    }

    public function sptOpL1D(): HasMany
    {
        return $this->hasMany(SptOpL1D::class, 'spt_op_id');
    }

    public function sptOpL1E(): HasMany
    {
        return $this->hasMany(SptOpL1E::class, 'spt_op_id');
    }

    // Lampiran 2
    public function sptOpL2A(): HasMany
    {
        return $this->hasMany(SptOpL2A::class, 'spt_op_id');
    }

    public function sptOpL2B(): HasMany
    {
        return $this->hasMany(SptOpL2B::class, 'spt_op_id');
    }

    public function sptOpL2C(): HasMany
    {
        return $this->hasMany(SptOpL2C::class, 'spt_op_id');
    }

    // Lampiran 3A
    public function sptOpL3A13A1(): HasMany
    {
        return $this->hasMany(SptOpL3A13A1::class, 'spt_op_id');
    }

    public function sptOpL3A13A2(): HasMany
    {
        return $this->hasMany(SptOpL3A13A2::class, 'spt_op_id');
    }

    public function sptOpL3A4A(): HasMany
    {
        return $this->hasMany(SptOpL3A4A::class, 'spt_op_id');
    }

    public function sptOpL3A4B(): HasMany
    {
        return $this->hasMany(SptOpL3A4B::class, 'spt_op_id');
    }

    // Lampiran 3B
    public function sptOpL3B(): HasMany
    {
        return $this->hasMany(SptOpL3B::class, 'spt_op_id');
    }

    // Lampiran 3C
    public function sptOpL3C(): HasMany
    {
        return $this->hasMany(SptOpL3C::class, 'spt_op_id');
    }

    // Lampiran 3D
    public function sptOpL3DA(): HasMany
    {
        return $this->hasMany(SptOpL3DA::class, 'spt_op_id');
    }

    public function sptOpL3DB(): HasMany
    {
        return $this->hasMany(SptOpL3DB::class, 'spt_op_id');
    }

    public function sptOpL3DC(): HasMany
    {
        return $this->hasMany(SptOpL3DC::class, 'spt_op_id');
    }

    // Lampiran 4
    public function sptOpL4A(): HasOne
    {
        return $this->hasOne(SptOpL4A::class, 'spt_op_id');
    }

    // Lampiran 5
    public function sptOpL5A(): HasMany
    {
        return $this->hasMany(SptOpL5A::class, 'spt_op_id');
    }

    public function sptOpL5BC(): HasMany
    {
        return $this->hasMany(SptOpL5BC::class, 'spt_op_id');
    }
}
