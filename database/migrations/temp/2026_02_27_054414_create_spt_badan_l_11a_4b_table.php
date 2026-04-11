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
        Schema::create('spt_badan_l_11_a_4b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('address');
            $table->bigInteger('decision_areas_number')->default(0);
            $table->date('decision_areas_date')->nullable();
            $table->bigInteger('decision_longer_areas_number')->default(0);
            $table->date('decision_longer_areas_date')->nullable();
            $table->bigInteger('value_4a')->default(0);
            $table->bigInteger('value_4b')->default(0);
            $table->bigInteger('value_4c')->default(0);
            $table->bigInteger('value_4d')->default(0);
            $table->bigInteger('value_4e')->default(0);
            $table->bigInteger('value_4f')->default(0);
            $table->bigInteger('total')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11_a_4b');
    }
};
