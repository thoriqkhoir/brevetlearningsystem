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
        Schema::create('spt_badan_l_1_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('account_id')->constrained('master_accounts')->onUpdate('cascade')->onDelete('restrict');
            $table->enum('code', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])->default('a');
            $table->bigInteger('amount')->default(0);
            $table->bigInteger('non_taxable')->default(0);
            $table->bigInteger('subject_to_final')->default(0);
            $table->bigInteger('non_final')->default(0);
            $table->bigInteger('fiscal_positive')->default(0);
            $table->bigInteger('fiscal_negative')->default(0);
            $table->string('fiscal_code')->nullable();
            $table->bigInteger('fiscal_amount')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_1_a');
    }
};
