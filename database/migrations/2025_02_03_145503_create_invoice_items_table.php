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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('invoice_id')->constrained('invoices')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('master_items')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('unit_id')->constrained('master_units')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('item_type', ['barang', 'jasa'])->default('barang');
            $table->string('item_name');
            $table->integer('item_quantity');
            $table->bigInteger('item_price');
            $table->bigInteger('item_discount');
            $table->bigInteger('dpp');
            $table->bigInteger('dpp_lain');
            $table->bigInteger('ppn');
            $table->integer('ppnbm_rate');
            $table->bigInteger('ppnbm');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
