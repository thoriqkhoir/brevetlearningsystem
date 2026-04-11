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
        Schema::create('spt_badan_l_12a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->bigInteger('taxable_income')->default(0);
            $table->bigInteger('pph_payable')->default(0);
            $table->bigInteger('dpp')->default(0);
            $table->boolean('pph_26_a')->nullable()->default(null);
            $table->bigInteger('pph_26_a_value')->default(0);
            $table->boolean('pph_26_b')->nullable()->default(null);
            $table->boolean('pph_26_b_1')->nullable()->default(null);
            $table->bigInteger('pph_26_b_1_value')->default(0);
            $table->boolean('pph_26_b_2')->nullable()->default(null);
            $table->boolean('pph_26_b_2_a')->nullable()->default(null);
            $table->string('pph_26_b_2_a_value')->nullable();
            $table->boolean('pph_26_b_2_b')->nullable()->default(null);
            $table->string('pph_26_b_2_b_value')->nullable();
            $table->boolean('pph_26_b_2_c')->nullable()->default(null);
            $table->boolean('pph_26_b_2_d')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_12a');
    }
};
