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
        Schema::create('spt_op_l_3d_a', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->date('entertainment_date')->nullable();
            $table->string('entertainment_location')->nullable();
            $table->string('address')->nullable();
            $table->string('entertainment_type')->nullable();
            $table->integer('entertainment_amount')->default(0);
            $table->string('related_party')->nullable();
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
        Schema::dropIfExists('spt_op_l_3d_a');
    }
};
