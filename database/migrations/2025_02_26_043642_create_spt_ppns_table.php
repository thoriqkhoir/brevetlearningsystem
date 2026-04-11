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
        Schema::create('spt_ppn', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_id')->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('type', ['A1', 'A2', 'B1', 'B2', 'B3'])->default('A1');
            $table->string('no'); // no/code invoice, other
            $table->date('date');
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_address'); 
            $table->bigInteger('dpp');
            $table->bigInteger('dpp_lain');
            $table->bigInteger('ppn');
            $table->bigInteger('ppnbm');
            $table->string('retur_no')->nullable(); // no retur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_ppn');
    }
};
