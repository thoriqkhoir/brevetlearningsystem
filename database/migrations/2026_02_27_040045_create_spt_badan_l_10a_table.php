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
        Schema::create('spt_badan_l_10a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('npwp');
            $table->string('country')->nullable();
            $table->string('relationship')->nullable();
            $table->string('business_activities')->nullable();
            $table->string('transaction_type')->nullable();
            $table->bigInteger('transaction_value')->default(0);
            $table->string('transfer_pricing_method')->nullable();
            $table->string('reason_using_method')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_10a');
    }
};
