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
        Schema::create('spt_op_l_3d_b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('npwp')->nullable();
            $table->string('name')->nullable();
            $table->string('address')->nullable();
            $table->date('date')->nullable();
            $table->string('type_of_cost')->nullable();
            $table->integer('amount')->default(0);
            $table->string('notes')->nullable();
            $table->integer('income_tax_with_holding')->default(0);
            $table->string('with_holding_slip_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_3d_b');
    }
};
