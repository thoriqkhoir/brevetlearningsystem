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
        Schema::create('spt_badan_l_2_b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('country')->nullable();
            $table->string('npwp')->nullable();
            $table->string('position')->nullable();
            $table->bigInteger('equity_capital_amount')->default(0);
            $table->decimal('equity_capital_percentage', 5, 2)->nullable();
            $table->bigInteger('debt_amount')->default(0);
            $table->string('debt_year')->nullable();
            $table->bigInteger('debt_interest')->default(0);
            $table->bigInteger('receivables_amount')->default(0);
            $table->string('receivables_year')->nullable();
            $table->bigInteger('receivables_interest')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_2_b');
    }
};
