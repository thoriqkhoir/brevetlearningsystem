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
        Schema::create('spt_badan_l_3_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('country')->nullable();
            $table->dateTime('pph_date')->nullable();
            $table->string('type_income')->nullable();
            $table->bigInteger('net_income')->default(0);
            $table->bigInteger('pph_amount')->default(0);
            $table->string('pph_currency')->nullable();
            $table->bigInteger('pph_foreign_amount')->default(0);
            $table->bigInteger('tax_credit')->default(0);
           $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_3_a');
    }
};
