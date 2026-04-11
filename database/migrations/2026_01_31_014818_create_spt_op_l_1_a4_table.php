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
        Schema::create('spt_op_l_1_a4', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->string('code');
            $table->string('type')->nullable();
            $table->string('brand')->nullable();
            $table->string('police_number')->nullable();
            $table->string('ownership')->nullable();
            $table->string('owner_id')->nullable();
            $table->string('owner_name')->nullable();
            $table->string('acquisition_year')->nullable();
            $table->integer('acquisition_cost')->default(0);
            $table->integer('amount_now')->default(0);
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_1_a4');
    }
};
