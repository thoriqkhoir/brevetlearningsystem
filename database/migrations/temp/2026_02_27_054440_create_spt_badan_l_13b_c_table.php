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
        Schema::create('spt_badan_l_13b_c', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('proposal_number')->nullable();
            $table->string('expenses_start_period')->nullable();
            $table->string('expenses_end_period')->nullable();
            $table->bigInteger('total_cost')->default(0);
            $table->string('year_acquisition')->nullable();
            $table->decimal('facilities_percentage', 5, 2)->default(0);
            $table->string('additional_gross_income')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_13b_c');
    }
};
