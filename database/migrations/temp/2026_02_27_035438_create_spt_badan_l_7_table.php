<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spt_badan_l_7', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tax_year_part')->nullable();     // Tahun Bagian Pajak
            $table->bigInteger('amount')->default(0);           // Nilai
            $table->bigInteger('fourth_year')->default(0);      // Tahun Keempat
            $table->bigInteger('third_year')->default(0);       // Tahun Ketiga
            $table->bigInteger('second_year')->default(0);      // Tahun Kedua
            $table->bigInteger('first_year')->default(0);       // Tahun Pertama
            $table->bigInteger('year_now')->default(0);         // Tahun Pajak Berjalan
            $table->bigInteger('current_tax_year')->default(0);  // Tahun Pajak Sekarang
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_7');
    }
};
