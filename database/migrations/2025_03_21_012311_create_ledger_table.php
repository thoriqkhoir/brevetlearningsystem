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
        Schema::create('ledger', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('billing_id')->constrained('billings')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('billing_type_id')->constrained('master_billing_types')->onUpdate('cascade')->onDelete('cascade');
            $table->date('transaction_date');
            $table->date('posting_date');
            $table->enum('accounting_type', ['pembayaran', 'surat pemberitahuan', 'ketetapan pajak', 'kewajiban pajak lain', 'pengembalian', 'penyesuaian'])->default('pembayaran');
            $table->enum('accounting_type_detail', ['pembayaran tunai', 'spt normal', 'spt pembetulan', 'surat tagihan pajak', 'pemindahbukuan'])->default('pembayaran tunai');
            $table->string('currency');
            $table->enum('transaction_type', ['debit', 'credit']);
            $table->bigInteger('debit_amount');
            $table->bigInteger('debit_unpaid');
            $table->bigInteger('credit_amount');
            $table->bigInteger('credit_left');
            $table->string('kap');
            $table->string('kap_description');
            $table->string('kjs');
            $table->string('tax_period');
            $table->string('transaction_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledger');
    }
};
