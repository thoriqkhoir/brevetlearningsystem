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
        Schema::create('spt_badan_l_9', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('group_type', ['1a', '1b', '1c', '1d', '1e', '2a', '2b', '3a', '3b', '3c', '3d', '3e'])->default('1a');
            $table->string('treasure_code');
            $table->string('treasure_type');
            $table->dateTime('period_aquisition')->nullable();
            $table->bigInteger('cost_aquisition')->default(0);
            $table->bigInteger('residual_value')->default(0);
            $table->string('comercial_depreciation_method')->nullable();
            $table->string('fiscal_depreciation_method')->nullable();
            $table->bigInteger('depreciation_this_year')->default(0);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_9');
    }
};
