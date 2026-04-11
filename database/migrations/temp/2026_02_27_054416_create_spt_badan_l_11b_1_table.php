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
        Schema::create('spt_badan_l_11b_1', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->bigInteger('net_income')->default(0);
            $table->bigInteger('depreciation_expense')->default(0);
            $table->bigInteger('income_tax_expense')->default(0);
            $table->bigInteger('loan_tax_expense')->default(0);
            $table->bigInteger('ebtida')->default(0);
            $table->bigInteger('ebtida_after_tax')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11b_1');
    }
};
