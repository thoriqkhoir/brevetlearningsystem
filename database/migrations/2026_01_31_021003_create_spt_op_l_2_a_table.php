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
        Schema::create('spt_op_l_2_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('object_id')->constrained('master_objects')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tax_withholder_id')->nullable();
            $table->string('tax_withholder_name')->nullable();
            $table->integer('dpp')->default(0);
            $table->integer('pph_owed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_2_a');
    }
};
