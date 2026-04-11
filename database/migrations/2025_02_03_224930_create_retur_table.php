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
        Schema::create('retur', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('invoice_id')->constrained('invoices')->onUpdate('cascade')->onDelete('cascade');
            $table->string('retur_number');
            $table->date('retur_date');
            $table->char('retur_period');
            $table->char('retur_year');
            $table->bigInteger('dpp');
            $table->bigInteger('dpp_lain');
            $table->bigInteger('ppn');
            $table->bigInteger('ppnbm');
            $table->enum('type', ['keluaran', 'masukan'])->default('keluaran');
            $table->enum('status', ['created', 'approved', 'canceled', 'deleted', 'amanded'])->default('created');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur');
    }
};
