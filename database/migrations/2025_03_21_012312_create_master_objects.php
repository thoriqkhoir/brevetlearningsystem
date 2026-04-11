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
        Schema::create('master_objects', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['bppu', 'bpnr', 'sendiri', 'digunggung', 'pegawai', 'selain pegawai'])->default('bppu');
            $table->string('tax_code');
            $table->text('tax_name');
            $table->string('tax_type');
            $table->enum('tax_nature', ['final', 'tidak final'])->nullable();
            $table->string('tax_rates');
            $table->string('kap');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_objects');
    }
};
