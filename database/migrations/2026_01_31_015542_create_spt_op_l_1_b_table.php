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
        Schema::create('spt_op_l_1_b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('code');
            $table->string('description')->nullable();
            $table->string('creditor_id')->nullable();
            $table->string('creditor_name')->nullable();
            $table->string('creditor_country')->nullable();
            $table->string('ownership')->nullable();
            $table->string('loan_year')->nullable();
            $table->integer('balance')->default(0);
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_1_b');
    }
};
