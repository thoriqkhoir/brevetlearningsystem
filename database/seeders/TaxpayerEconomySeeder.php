<?php

namespace Database\Seeders;

use App\Models\TaxpayerEconomy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaxpayerEconomySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaxpayerEconomy::create(['code' => 'Z1110', 'name' => 'ANGGOTA MPR, DPR, DAN DPD', 'description' => 'ANGGOTA MPR, DPR, DAN DPD', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z1120', 'name' => 'ANGGOTA DPRD', 'description' => 'ANGGOTA DPRD', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z1210', 'name' => 'PRESIDEN DAN WAKIL PRESIDEN', 'description' => 'PRESIDEN DAN WAKIL PRESIDEN', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z1300', 'name' => 'HAKIM', 'description' => 'HAKIM', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z2100', 'name' => 'PEGAWAI NEGERI SIPIL (PNS)', 'description' => 'PEGAWAI NEGERI SIPIL (PNS)', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z5000', 'name' => 'PEKERJA BEBAS/PEGAWAI SWASTA', 'description' => 'PEKERJA BEBAS/PEGAWAI SWASTA', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => 'Z8000', 'name' => 'TIDAK/BELUM BEKERJA', 'description' => 'TIDAK/BELUM BEKERJA', 'start_date' => '2008-01-01',]);
        TaxpayerEconomy::create(['code' => '96034', 'name' => 'PEDAGANG KECIL/PEDAGANG ECERAN', 'description' => 'PEDAGANG KECIL/PEDAGANG ECERAN', 'start_date' => '2008-01-01',]);
    }
}
