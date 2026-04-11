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
        Schema::create('spt_badan_l_11a_2', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->dateTime('date')->nullable();
            $table->string('place')->nullable();
            $table->string('address')->nullable();
            $table->string('type')->nullable();
            $table->bigInteger('amount')->default(0);
            $table->string('name');
            $table->string('position')->nullable();
            $table->string('company_name')->nullable();
            $table->string('business_type')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_11a_2');
    }
};
