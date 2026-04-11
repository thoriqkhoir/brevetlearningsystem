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
        Schema::create('spt_op_l_4_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('regular_net_income')->default(0);
            $table->integer('final_loss')->default(0);
            $table->integer('zakat')->default(0);
            $table->integer('total_net_income')->default(0);
            $table->string('ptkp')->nullable();
            $table->integer('taxable_income')->default(0);
            $table->integer('income_tax_payable')->default(0);
            $table->integer('income_tax_deduction')->default(0);
            $table->integer('tax_credit')->default(0);
            $table->integer('income_tax_must_paid')->default(0);
            $table->integer('tax_installments')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_4_a');
    }
};
