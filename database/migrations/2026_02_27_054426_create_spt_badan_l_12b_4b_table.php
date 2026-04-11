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
        Schema::create('spt_badan_l_12b_4b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_l_12b_4_id')->constrained('spt_badan_l_12b_4')->onUpdate('cascade')->onDelete('cascade');
            $table->string('investment_name')->nullable();
            $table->bigInteger('realization_value')->default(0);
            $table->string('realization_year')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_12b_4b');
    }
};
