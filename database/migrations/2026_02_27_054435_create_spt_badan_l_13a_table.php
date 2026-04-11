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
        Schema::create('spt_badan_l_13a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('decision_grant_facilities_number')->nullable();
            $table->dateTime('decision_grant_facilities_date')->nullable();
            $table->string('decision_utilization_facilities_number')->nullable();
            $table->dateTime('decision_utilization_facilities_date')->nullable();
            $table->bigInteger('amount_capital_naming_in_foreign')->default(0);
            $table->bigInteger('amount_capital_naming_equivalen')->default(0);
            $table->bigInteger('amount_capital_naming_in_rupiah')->default(0);
            $table->bigInteger('amount_capital_naming_total')->default(0);
            $table->string('capital_naming')->nullable();
            $table->string('field')->nullable();
            $table->string('facilities')->nullable();
            $table->decimal('reduce_net_income_persentage', 5, 2)->default(0);
            $table->string('additional_period')->nullable();
            $table->bigInteger('realization_capital_naming_acumulation')->default(0);
            $table->string('realization_capital_naming_start_production')->nullable();
            $table->string('start_comercial_production')->nullable();
            $table->string('reducer_net_income_year')->nullable();
            $table->bigInteger('reducer_net_income_amount')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_13a');
    }
};
