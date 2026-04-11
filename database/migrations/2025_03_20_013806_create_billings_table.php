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
        Schema::create('billings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('spt_id')->nullable()->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('billing_type_id')->constrained('master_billing_types')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('billing_payment_id')->nullable()->constrained('master_billing_payments')->onUpdate('cascade')->onDelete('cascade');
            $table->bigInteger('billing_form_id');
            $table->char('start_period');
            $table->char('end_period');
            $table->char('year');
            $table->string('currency');
            $table->bigInteger('amount');
            $table->string('amount_in_words');
            $table->char('period_for')->nullable();
            $table->char('year_for')->nullable();
            $table->string('description')->nullable();
            $table->enum('status', ['paid', 'unpaid'])->default('paid');
            $table->date('active_period');
            $table->string('code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
