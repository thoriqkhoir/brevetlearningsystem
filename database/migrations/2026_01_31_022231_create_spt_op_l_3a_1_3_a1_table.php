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
        Schema::create('spt_op_l_3a_1_3_a1', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('account_id')->constrained('master_accounts')->onUpdate('cascade')->onDelete('restrict');
            $table->enum('type', ['dagang', 'jasa', 'industri'])->default('dagang');
            $table->integer('commercial_value')->default(0);
            $table->integer('non_taxable')->default(0);
            $table->integer('subject_to_final')->default(0);
            $table->integer('non_final')->default(0);
            $table->integer('positive_fiscal')->default(0);
            $table->integer('negative_fiscal')->default(0);
            $table->string('correction_code')->nullable();
            $table->integer('fiscal_amount')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_3a_1_3_a1');
    }
};
