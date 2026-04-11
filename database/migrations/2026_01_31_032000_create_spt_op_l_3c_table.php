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
        Schema::create('spt_op_l_3c', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('type', ['tangible', 'building', 'intangible'])->nullable();
            $table->string('sub_type')->nullable();
            $table->string('code');
            $table->string('asset_type')->nullable();
            $table->string('period_acquisition')->nullable();
            $table->integer('cost_acquisition')->default(0);
            $table->integer('begining_fiscal_book')->default(0);
            $table->string('method_commercial')->nullable();
            $table->string('method_fiscal')->nullable();
            $table->integer('fiscal_depreciation')->default(0);
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_3c');
    }
};
