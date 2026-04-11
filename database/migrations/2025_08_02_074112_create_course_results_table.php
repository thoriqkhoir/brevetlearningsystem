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
        Schema::create('course_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('course_user_id')->constrained('course_users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('invoice_id')->nullable()->constrained('invoices')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('retur_id')->nullable()->constrained('retur')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('other_id')->nullable()->constrained('others')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('retur_other_id')->nullable()->constrained('retur_other')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('bupot_id')->nullable()->constrained('bupot')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('bupot_a1_id')->nullable()->constrained('bupot_a1')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('bupot_a2_id')->nullable()->constrained('bupot_a2')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('spt_id')->nullable()->constrained('spt')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('billing_id')->nullable()->constrained('billings')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('ledger_id')->nullable()->constrained('ledger')->onUpdate('cascade')->onDelete('set null');
            $table->integer('score')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_results');
    }
};
