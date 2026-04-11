<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Spt2126Detail extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'spt_2126_details';

    protected $fillable = [
        'spt2126_id',
        'tab_type',
        'npwp',
        'name',
        'doc_no',
        'doc_date',
        'tax_type',
        'tax_code',
        'tax_name',  // kolom ini hilang dari migrasi
        'dpp',
        'tarif',
        'tax',
        'facility',
        'description', // kolom ini hilang dari migrasi
    ];

    

    /**
     * Get the SPT 21/26 that owns this detail
     */
    public function spt2126(): BelongsTo
    {
        return $this->belongsTo(Spt2126::class);
    }

    /**
     * Scope a query to filter by tab type
     */
    public function scopeOfTabType($query, $tabType)
    {
        return $query->where('tab_type', $tabType);
    }

    /**
     * Scope a query to filter by facility type
     */
    public function scopeOfFacility($query, $facility)
    {
        return $query->where('facility', $facility);
    }
}