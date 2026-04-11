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
        Schema::create('spt_op_l_2_c', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('provider_name');
            $table->string('country')->nullable();
            $table->date('transaction_date')->nullable();
            $table->string('income_type')->nullable();
            $table->string('income_code')->nullable();
            $table->integer('net_income')->default(0);
            $table->integer('tax_foreign_currency')->default(0);
            $table->integer('amount')->default(0);
            $table->string('currency')->nullable();
            $table->integer('tax_credit')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_2_c');
    }
};
