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
        Schema::create('spt_badan_l_11a_4a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tangible_asset_type')->nullable();
            $table->string('acquisition_year')->nullable();
            $table->bigInteger('acquisition_value')->default(0);
            $table->bigInteger('depreciation_last_year')->default(0);
            $table->bigInteger('depreciation_this_year')->default(0);
            $table->bigInteger('depreciation_remaining')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11a_4a');
    }
};
