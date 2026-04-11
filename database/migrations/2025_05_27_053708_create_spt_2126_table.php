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
        Schema::create('spt_2126', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_id')->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('ppha1')->default(0);
            $table->integer('ppha2')->default(0);
            $table->integer('ppha3')->default(0);
            $table->integer('ppha4')->default(0);
            $table->integer('ppha5')->default(0);
            $table->integer('ppha6')->default(0);
            $table->integer('pphapemerintah')->default(0);
            $table->integer('pphb1')->default(0);
            $table->integer('pphb2')->default(0);
            $table->integer('pphb3')->default(0);
            $table->integer('pphb4')->default(0);
            $table->integer('pphb5')->default(0);
            $table->integer('pphb6')->default(0);
            $table->integer('pphbpemerintah')->default(0);
            $table->enum('penandatangan', ['Wajib Pajak', 'Kuasa Wajib Pajak'])->default('Wajib Pajak');
            $table->string('ttd_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_2126');
    }
};
