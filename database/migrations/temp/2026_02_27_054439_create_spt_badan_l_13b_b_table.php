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
        Schema::create('spt_badan_l_13b_b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->bigInteger('amount_1a')->default(0);
            $table->bigInteger('amount_1b')->default(0);
            $table->bigInteger('amount_1c')->default(0);
            $table->bigInteger('amount_1d')->default(0);
            $table->bigInteger('amount_1e')->default(0);
            $table->bigInteger('amount_2')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_13b_b');
    }
};
