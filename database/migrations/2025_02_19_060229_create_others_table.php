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
        Schema::create('others', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('transaction_type');
            $table->string('transaction_detail');
            $table->string('transaction_doc');
            $table->string('other_no');
            $table->date('other_date');
            $table->char('other_period');
            $table->char('other_year');
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_address');
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
        Schema::dropIfExists('others');
    }
};
