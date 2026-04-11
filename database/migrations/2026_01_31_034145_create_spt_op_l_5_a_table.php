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
        Schema::create('spt_op_l_5_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tax_year')->nullable();
            $table->integer('fiscal_amount')->default(0);
            $table->integer('compensation_year_a')->default(0);
            $table->integer('compensation_year_b')->default(0);
            $table->integer('compensation_year_c')->default(0);
            $table->integer('compensation_year_d')->default(0);
            $table->integer('compensation_year_e')->default(0);
            $table->integer('compensation_year_f')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_5_a');
    }
};
