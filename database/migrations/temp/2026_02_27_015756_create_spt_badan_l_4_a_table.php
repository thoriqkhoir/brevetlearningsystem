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
        Schema::create('spt_badan_l_4_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('npwp');
            $table->string('name');
            $table->string('tax_object_code')->nullable();
            $table->string('tax_object_name')->nullable();
            $table->bigInteger('dpp')->default(0);
            $table->decimal('rate', 15, 2)->default(0);
            $table->bigInteger('pph_payable')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_4_a');
    }
};
