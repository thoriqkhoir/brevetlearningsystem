<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spt2126 extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'spt_2126';

    protected $fillable = [
        'spt_id',
        // PPh 21 fields
        'ppha1',
        'ppha2',
        'ppha3',
        'ppha4',
        'ppha5',
        'ppha6',
        'pphapemerintah',
        // PPh 26 fields
        'pphb1',
        'pphb2',
        'pphb3',
        'pphb4',
        'pphb5',
        'pphb6',
        'pphbpemerintah',
        // Signature information
        'ttd_name',
        'penandatangan',
    ];

    protected $casts = [
        'ppha1' => 'integer',
        'ppha2' => 'integer',
        'ppha3' => 'integer',
        'ppha4' => 'integer',
        'ppha5' => 'integer',
        'ppha6' => 'integer',
        'pphapemerintah' => 'integer',
        'pphb1' => 'integer',
        'pphb2' => 'integer',
        'pphb3' => 'integer',
        'pphb4' => 'integer',
        'pphb5' => 'integer',
        'pphb6' => 'integer',
        'pphbpemerintah' => 'integer',
    ];

    /**
     * Get the SPT that owns this SPT 21/26
     */
    public function spt(): BelongsTo
    {
        return $this->belongsTo(Spt::class);
    }

    /**
     * Get the details for this SPT 21/26
     */
    public function details(): HasMany
    {
        return $this->hasMany(Spt2126Detail::class);
    }

    /**
     * Get total PPh 21 value
     */
    public function getTotalPph21Attribute(): int
    {
        return $this->ppha1 +
               $this->ppha2 +
               $this->ppha3 +
               $this->ppha4 +
               $this->ppha5 +
               $this->ppha6 +
               $this->pphapemerintah;
    }

    /**
     * Get total PPh 26 value
     */
    public function getTotalPph26Attribute(): int
    {
        return $this->pphb1 +
               $this->pphb2 +
               $this->pphb3 +
               $this->pphb4 +
               $this->pphb5 +
               $this->pphb6 +
               $this->pphbpemerintah;
    }

    /**
     * Get combined total tax value
     */
    public function getTotalTaxAttribute(): int
    {
        return $this->total_pph21 + $this->total_pph26;
    }
}