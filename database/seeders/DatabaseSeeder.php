<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Event::create([
            'code' => 'PUB001',
            'name' => 'Public',
        ]);

        User::factory()->create([
            'event_id' => 1,
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'phone_number' => '081234567890',
            'npwp' => '123456789012345',
            'address' => 'Perumahan Permata Permadani, Blok B1. Kel. Pendem Kec. Junrejo Kota Batu Prov. Jawa Timur, 65324',
            'access_rights' => json_encode(['efaktur', 'ebupot']),
            'role' => 'admin',
            'password' => bcrypt('admin'),
        ]);

        $this->call(MasterTableSeeder::class);
        $this->call(TaxpayerEconomySeeder::class);
    }
}
