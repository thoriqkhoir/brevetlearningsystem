<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\BusinessEntity;

class SptBadan extends Model
{
    use HasUuids;

    protected $table = 'spt_badan';

    protected $fillable = [
        'business_entity_id',
        'spt_id',
        'bank_id',
        'type_of_bookkeeping',
        // B - Identitas Pemotong/Pemungut
        'b_1a',
        'b_2',
        'b_2a',
        'b_2b',
        'b_2c',
        // C - Angsuran PPh Pasal 25
        'c_1a',
        'c_1b',
        'c_2',
        'c_2_value',
        'c_3',
        'c_3_value',
        // D - PPh Terutang
        'd_4',
        'd_5',
        'd_5_value',
        'd_6',
        'd_6_value',
        'd_7',
        'd_8',
        'd_8_value',
        'd_9',
        'd_10',
        'd_10_value',
        'd_11',
        'd_11_percentage',
        'd_12',
        // E - Kredit Pajak
        'e_13',
        'e_13_value',
        'e_14',
        'e_15',
        'e_16',
        'e_16_value',
        // F - PPh Kurang/Lebih Bayar
        'f_17a',
        'f_17b',
        'f_17b_value',
        'f_17c',
        'f_18a',
        'f_18a_value',
        'f_18b',
        'f_19a',
        // Rekening Pengembalian
        'account_number',
        'bank_name',
        'account_name',
        // G - Angsuran Berikutnya
        'g_20',
        'g_20_value',
        // Lampiran
        'f_21a',
        'f_21b',
        'f_21c',
        'f_21d',
        'f_21e',
        'f_21f',
        'f_21g',
        'f_21h',
        'f_21i',
        'f_21j',
        // I - Identitas Penanggung Jawab
        'i_a_1',
        'i_a_2',
        'i_b',
        'i_c',
        'i_d',
        'i_e',
        'i_f',
        'i_f_1',
        'i_f_2',
        'i_f_3',
        'i_f_4',
        'i_g',
        'i_h_1',
        'i_h_2',
        'i_i',
        'i_j',
        // J - Penandatangan
        'j_signer',
        'j_signer_id',
        'j_signer_name',
        'j_signer_position',
    ];

    protected $casts = [
        'b_2'  => 'boolean',
        'c_1a' => 'boolean',
        'c_1b' => 'boolean',
        'c_2'  => 'boolean',
        'c_3'  => 'boolean',
        'd_5'  => 'boolean',
        'd_6'  => 'boolean',
        'd_8'  => 'boolean',
        'd_10' => 'boolean',
        'e_13' => 'boolean',
        'e_16' => 'boolean',
        'f_17b' => 'boolean',
        'f_18a' => 'boolean',
        'g_20'  => 'boolean',
        'f_21a' => 'boolean',
        'f_21b' => 'boolean',
        'f_21c' => 'boolean',
        'f_21d' => 'boolean',
        'f_21e' => 'boolean',
        'f_21f' => 'boolean',
        'f_21g' => 'boolean',
        'f_21h' => 'boolean',
        'f_21i' => 'boolean',
        'd_11_percentage' => 'decimal:2',
    ];

    public function spt()
    {
        return $this->belongsTo(Spt::class);
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

    public function businessEntity()
    {
        return $this->belongsTo(BusinessEntity::class);
    }
}
