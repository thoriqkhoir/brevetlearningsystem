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
        Schema::create('bupot_a2', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('object_id')->constrained('master_objects')->onUpdate('cascade')->onDelete('cascade');
            $table->char('bupot_number')->nullable();
            $table->enum('is_more', ['ya', 'tidak']);
            $table->char('start_period');
            $table->char('end_period');     
            $table->enum('bupot_status',['normal', 'perbaikan'])->default('normal');
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('nip');
            $table->string('rank_group');
            $table->string('customer_ptkp');
            $table->string('customer_position');
            $table->string('tax_type');
            $table->string('tax_code');
            $table->string('bupot_types');
            $table->bigInteger('basic_salary')->default(0);
            $table->bigInteger('wifes_allowance')->default(0);
            $table->bigInteger('childs_allowance')->default(0);
            $table->bigInteger('income_improvement_allowance')->default(0);
            $table->bigInteger('fungtional_allowance')->default(0);
            $table->bigInteger('rice_allowance')->default(0);
            $table->bigInteger('other_allowance')->default(0);
            $table->bigInteger('separate_salary')->default(0);
            $table->bigInteger('gross_income_amount')->default(0);
            $table->bigInteger('position_allowance')->default(0);
            $table->bigInteger('pension_contribution')->default(0);
            $table->bigInteger('zakat')->default(0);
            $table->bigInteger('amount_of_reduction')->default(0);
            $table->bigInteger('neto')->default(0);
            $table->bigInteger('proof_number')->default(0);
            $table->bigInteger('before_neto')->default(0);
            $table->bigInteger('total_neto')->default(0);
            $table->bigInteger('non_taxable_income')->default(0);
            $table->bigInteger('taxable_income')->default(0);
            $table->bigInteger('pph_taxable_income')->default(0);
            $table->bigInteger('pph_owed')->default(0);
            $table->bigInteger('pph_deducted')->default(0);
            $table->bigInteger('pph_deducted_withholding')->default(0);
            $table->bigInteger('pph_hasbeen_deducted')->default(0);
            $table->bigInteger('pph_desember')->default(0);
            $table->string('kap');
            $table->string('nitku');
            $table->enum('status', ['created', 'draft', 'approved', 'canceled'])->default('created');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bupot_a1');
    }
};
