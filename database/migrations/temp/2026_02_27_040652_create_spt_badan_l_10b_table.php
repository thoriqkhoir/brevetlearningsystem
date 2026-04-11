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
        Schema::create('spt_badan_l_10b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->boolean('is_1a')->nullable()->default(null);
            $table->boolean('is_1b')->nullable()->default(null);
            $table->boolean('is_1c')->nullable()->default(null);
            $table->boolean('is_1d')->nullable()->default(null);
            $table->boolean('is_2a')->nullable()->default(null);
            $table->boolean('is_2b')->nullable()->default(null);
            $table->boolean('is_2c')->nullable()->default(null);
            $table->boolean('is_3a')->nullable()->default(null);
            $table->boolean('is_3b')->nullable()->default(null);
            $table->boolean('is_3c')->nullable()->default(null);
            $table->boolean('is_3d')->nullable()->default(null);
            $table->boolean('is_3e')->nullable()->default(null);
            $table->boolean('is_4a')->nullable()->default(null);
            $table->boolean('is_4b')->nullable()->default(null);
            $table->boolean('is_4c')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_10b');
    }
};
