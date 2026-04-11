<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SptUnifikasiDetail extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'spt_unifikasi_details';
    
    protected $fillable = [
        'spt_unifikasi_id',
        'tab_type',
        'npwp',
        'name',
        'doc_no',
        'doc_date',
        'tax_type',
        'tax_code',
        'tax_name',
        'dpp',
        'tarif',
        'tax',
        'facility',
        'description',
        // Tambahkan field lain yang mungkin dibutuhkan
    ];

    // Relasi ke model SptUnifikasi
    public function sptUnifikasi()
    {
        return $this->belongsTo(SptUnifikasi::class, 'spt_unifikasi_id');
    }
}