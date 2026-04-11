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
        Schema::create('taxpayer_source_incomes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('taxpayer_accounting_id')->constrained('taxpayer_accountings')->onDelete('cascade');
            $table->string('source_income');
            $table->string('workplace');
            $table->string('monthly_income');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_source_incomes');
    }
};
