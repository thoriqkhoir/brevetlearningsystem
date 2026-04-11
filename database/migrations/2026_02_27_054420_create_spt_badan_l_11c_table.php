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
        Schema::create('spt_badan_l_11c', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('region')->nullable();
            $table->string('currency_code')->nullable();
            $table->bigInteger('currency_end_year')->default(0);
            $table->bigInteger('principal_debt_start_year')->default(0);
            $table->bigInteger('principal_debt_addition')->default(0);
            $table->bigInteger('principal_debt_reducer')->default(0);
            $table->bigInteger('principal_debt_end_year')->default(0);
            $table->dateTime('start_loan_term')->nullable();
            $table->dateTime('end_loan_term')->nullable();
            $table->decimal('interest_rate', 5, 2)->default(0);
            $table->bigInteger('interest_amount')->default(0);
            $table->bigInteger('cost_other')->default(0);
            $table->string('loan_allocation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11c');
    }
};
