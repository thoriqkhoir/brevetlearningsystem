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
        Schema::create('spt_badan_l_12b_5', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('name');
            $table->string('npwp');
            $table->string('address')->nullable();
            $table->string('business_type')->nullable();
            $table->string('deed_incorporation_number')->nullable();
            $table->dateTime('deed_incorporation_date')->nullable();
            $table->string('deed_incorporation_notary')->nullable();
            $table->bigInteger('investment_value')->default(0);
            $table->string('active_period')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_12b_5');
    }
};
