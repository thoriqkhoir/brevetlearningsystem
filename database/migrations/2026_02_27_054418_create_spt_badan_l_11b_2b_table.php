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
        Schema::create('spt_badan_l_11_b_2b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('cost_breakdown');
            $table->bigInteger('month_balance_1')->default(0);
            $table->bigInteger('month_balance_2')->default(0);
            $table->bigInteger('month_balance_3')->default(0);
            $table->bigInteger('month_balance_4')->default(0);
            $table->bigInteger('month_balance_5')->default(0);
            $table->bigInteger('month_balance_6')->default(0);
            $table->bigInteger('month_balance_7')->default(0);
            $table->bigInteger('month_balance_8')->default(0);
            $table->bigInteger('month_balance_9')->default(0);
            $table->bigInteger('month_balance_10')->default(0);
            $table->bigInteger('month_balance_11')->default(0);
            $table->bigInteger('month_balance_12')->default(0);
            $table->bigInteger('average_balance')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11_b_2b');
    }
};
