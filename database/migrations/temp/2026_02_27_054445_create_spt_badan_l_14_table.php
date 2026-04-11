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
        Schema::create('spt_badan_l_14', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tax_year')->nullable();
            $table->bigInteger('provision_remaining')->nullable();
            $table->string('replanting_form_surfer')->nullable();
            $table->bigInteger('year_1')->nullable();
            $table->bigInteger('year_2')->nullable();
            $table->bigInteger('year_3')->nullable();
            $table->bigInteger('year_4')->nullable();
            $table->bigInteger('remaining_amount')->nullable();
            $table->bigInteger('unreplaced_excess')->nullable();
            $table->bigInteger('surplus_year_replanting_period')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_14');
    }
};
