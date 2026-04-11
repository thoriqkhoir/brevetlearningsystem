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
        Schema::create('taxpayer_source_income_economies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('taxpayer_source_income_id');
            $table->uuid('taxpayer_economy_id');
            $table->timestamps();

            $table->foreign('taxpayer_source_income_id', 'fk_tsie_si')
                ->references('id')
                ->on('taxpayer_source_incomes')
                ->onDelete('cascade');

            $table->foreign('taxpayer_economy_id', 'fk_tsie_eco')
                ->references('id')
                ->on('taxpayer_economies')
                ->onDelete('cascade');

            $table->unique(['taxpayer_source_income_id', 'taxpayer_economy_id'], 'uk_tsie_combo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_source_income_economies');
    }
};
