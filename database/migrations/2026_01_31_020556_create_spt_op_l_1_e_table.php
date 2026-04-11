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
        Schema::create('spt_op_l_1_e', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tax_withholder_name')->nullable();
            $table->string('tax_withholder_id')->nullable();
            $table->string('tax_withholder_slip_number')->nullable();
            $table->date('tax_withholder_slip_date')->nullable();
            $table->string('tax_type')->nullable();
            $table->integer('gross_income')->default(0);
            $table->integer('amount')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_1_e');
    }
};
