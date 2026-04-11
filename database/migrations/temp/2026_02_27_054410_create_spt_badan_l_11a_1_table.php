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
        Schema::create('spt_badan_l_11a_1', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('npwp');
            $table->string('name');
            $table->string('address')->nullable();
            $table->dateTime('date')->nullable();
            $table->string('cost_type')->nullable();
            $table->bigInteger('amount')->default(0);
            $table->string('note')->nullable();
            $table->bigInteger('pph')->default(0);
            $table->string('witholding_tax_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11a_1');
    }
};
