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
        Schema::create('spt', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('form_id')->constrained('master_forms')->onUpdate('cascade')->onDelete('cascade');
            $table->tinyInteger('correction_number')->default(0);
            $table->char('start_period');
            $table->char('end_period');
            $table->char('year');
            $table->enum('tax_type', ['nihil', 'kurang bayar', 'lebih bayar'])->nullable();
            $table->bigInteger('tax_value');
            $table->enum('spt_period_type', ['tahunan', 'bagian_tahun_pajak'])->nullable();
            $table->bigInteger('payment_value')->nullable();
            $table->datetime('paid_date')->nullable();
            $table->enum('status', ['created', 'approved', 'canceled', 'rejected', 'amanded', 'waiting'])->default('created');
            $table->string('ntte')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt');
    }
};
