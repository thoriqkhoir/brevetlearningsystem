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
        Schema::create('spt_badan_l_13c', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_badan_id')->constrained('spt_badan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('grant_facilities_number')->nullable();
            $table->dateTime('grant_facilities_date')->nullable();
            $table->string('utilization_facilities_number')->nullable();
            $table->dateTime('utilization_facilities_date')->nullable();
            $table->string('facilities_period')->nullable();
            $table->string('utilization_year')->nullable();
            $table->decimal('pph_reducer_percentage', 5, 2)->default(0);
            $table->bigInteger('taxable_income')->default(0);
            $table->bigInteger('pph_payable')->default(0);
            $table->bigInteger('facilities_amount')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badan_l_13c');
    }
};
