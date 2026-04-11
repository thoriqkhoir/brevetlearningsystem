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
        Schema::create('spt_badan_l_10d', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->boolean('is_i_a')->nullable()->default(null);
            $table->boolean('is_i_b')->nullable()->default(null);
            $table->boolean('is_i_c')->nullable()->default(null);
            $table->boolean('is_i_d')->nullable()->default(null);
            $table->boolean('is_i_e')->nullable()->default(null);
            $table->boolean('is_ii_a')->nullable()->default(null);
            $table->boolean('is_ii_b')->nullable()->default(null);
            $table->boolean('is_ii_c')->nullable()->default(null);
            $table->boolean('is_ii_d')->nullable()->default(null);
            $table->boolean('is_ii_e')->nullable()->default(null);
            $table->dateTime('iii_a')->nullable();
            $table->dateTime('iii_b')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_10d');
    }
};
