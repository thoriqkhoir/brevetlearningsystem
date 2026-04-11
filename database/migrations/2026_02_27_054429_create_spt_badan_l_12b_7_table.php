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
        Schema::create('spt_badan_l_12b_7', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('fixed_asset_type');
            $table->string('fixed_asset_location');
            $table->bigInteger('quantity')->default(0);
            $table->bigInteger('fixed_asset_value')->default(0);
            $table->string('fixed_asset_number')->nullable();
            $table->dateTime('fixed_asset_date')->nullable();
            $table->string('document_number')->nullable();
            $table->dateTime('document_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_12b_7');
    }
};
