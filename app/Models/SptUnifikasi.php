<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SptUnifikasi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'spt_unifikasi';
    
    protected $fillable = [
        'spt_id',
        'setor_1',
        'setor_1a',
        'setor_1b',
        'setor_1c',
        'setor_2',
        'setor_2a',
        'setor_2b',
        'setor_3',
        'setor_3a',
        'setor_3b',
        'setor_3c',
        'setor_4',
        'setor_4a',
        'setor_5',
        'setor_5a',
        'pemotongan_1',
        'pemotongan_1a',
        'pemotongan_1b',
        'pemotongan_1c',
        'pemotongan_2',
        'pemotongan_2a',
        'pemotongan_2b',
        'pemotongan_3',
        'pemotongan_3a',
        'pemotongan_3b',
        'pemotongan_3c',
        'pemotongan_4',
        'pemotongan_4a',
        'pemotongan_5',
        'pemotongan_5a',
        'pphpemerintah_1',
        'pphpemerintah_1a',
        'pphpemerintah_1b',
        'pphpemerintah_1c',
        'pphpemerintah_2',
        'pphpemerintah_2a',
        'pphpemerintah_2b',
        'pphpemerintah_3',
        'pphpemerintah_3a',
        'pphpemerintah_3b',
        'pphpemerintah_3c',
        'pphpemerintah_4',
        'pphpemerintah_4a',
        'pphpemerintah_5',
        'pphpemerintah_5a',
        'jumlahpph_1',
        'jumlahpph_1a',
        'jumlahpph_1b',
        'jumlahpph_1c',
        'jumlahpph_2',
        'jumlahpph_2a',
        'jumlahpph_2b',
        'jumlahpph_3',
        'jumlahpph_3a',
        'jumlahpph_3b',
        'jumlahpph_3c',
        'jumlahpph_4',
        'jumlahpph_4a',
        'jumlahpph_5',
        'jumlahpph_5a',
        'pphdibetulkan_1',
        'pphdibetulkan_1a',
        'pphdibetulkan_1b',
        'pphdibetulkan_1c',
        'pphdibetulkan_2',
        'pphdibetulkan_2a',
        'pphdibetulkan_2b',
        'pphdibetulkan_3',
        'pphdibetulkan_3a',
        'pphdibetulkan_3b',
        'pphdibetulkan_3c',
        'pphdibetulkan_4',
        'pphdibetulkan_4a',
        'pphdibetulkan_5',
        'pphdibetulkan_5a',
        'pphkurangbayar_1',
        'pphkurangbayar_1a',
        'pphkurangbayar_1b',
        'pphkurangbayar_1c',
        'pphkurangbayar_2',
        'pphkurangbayar_2a',
        'pphkurangbayar_2b',
        'pphkurangbayar_3',
        'pphkurangbayar_3a',
        'pphkurangbayar_3b',
        'pphkurangbayar_3c',
        'pphkurangbayar_4',
        'pphkurangbayar_4a',
        'pphkurangbayar_5',
        'pphkurangbayar_5a',
        'total_setor',
        'total_pemotongan',
        'total_pphpemerintah',
        'total_jumlahpph',
        'total_pphdibetulkan',
        'total_pphkurangbayar',
        'ttd_npwp',
        'ttd_name',
        'penandatangan',
    ];

    protected $guarded = ['created_at','updated_at'];

    // Relasi ke model Spt
    public function spt()
    {
        return $this->belongsTo(Spt::class, 'spt_id');
    }

    // Relasi ke model SptUnifikasiDetail
    public function details()
    {
        return $this->hasMany(SptUnifikasiDetail::class, 'spt_unifikasi_id');
    }
}