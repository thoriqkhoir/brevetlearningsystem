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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('transaction_id')->constrained('master_transactions')->onUpdate('cascade')->onDelete('cascade');
            $table->string('transaction_code');
            $table->string('invoice_number');
            $table->date('invoice_date');
            $table->char('invoice_period');
            $table->char('invoice_year');
            $table->string('invoice_reference')->nullable();
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_address');
            $table->bigInteger('dpp');
            $table->bigInteger('dpp_lain');
            $table->bigInteger('ppn');
            $table->bigInteger('ppnbm');
            $table->bigInteger('dpp_split')->nullable();
            $table->bigInteger('ppn_split')->nullable();
            $table->bigInteger('ppnbm_split')->nullable();
            $table->tinyInteger('correction_number')->default(0);
            $table->enum('type', ['keluaran', 'masukan'])->default('keluaran');
            $table->enum('status', ['created', 'approved', 'canceled', 'deleted', 'amanded', 'credit', 'uncredit'])->default('created');
            $table->enum('payment_type', ['lunas', 'uang muka', 'pelunasan'])->nullable();
            $table->date('credit_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
