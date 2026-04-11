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
        Schema::create('spt_badan_l_3_b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('npwp')->nullable();
            $table->string('tax_type')->nullable();
            $table->bigInteger('dpp')->default(0);
            $table->bigInteger('income_tax')->default(0);
            $table->string('number_of_provement')->nullable();
            $table->dateTime('date_of_provement')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_3_b');
    }
};
