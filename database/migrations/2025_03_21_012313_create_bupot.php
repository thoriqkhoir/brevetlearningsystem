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
        Schema::create('bupot', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('object_id')->constrained('master_objects')->onUpdate('cascade')->onDelete('cascade');
            $table->char('bupot_number')->nullable();
            $table->char('bupot_period');
            $table->char('bupot_year');
            $table->enum('bupot_status', ['normal', 'perbaikan'])->default('normal');
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('customer_address')->nullable();
            $table->string('customer_country')->nullable();
            $table->date('customer_birth_date')->nullable();
            $table->string('customer_birth_place')->nullable();
            $table->string('customer_passport')->nullable();
            $table->string('customer_permit')->nullable();
            $table->string('customer_ptkp')->nullable();
            $table->string('customer_position')->nullable();
            $table->enum('facility', ['fasilitas lainnya', 'pph ditanggung pemerintah', 'tanpa fasilitas'])->default('tanpa fasilitas');
            $table->bigInteger('dpp');
            $table->double('rates');
            $table->bigInteger('tax');
            $table->string('doc_type');
            $table->string('doc_no');
            $table->date('doc_date');
            $table->enum('status', ['created', 'approved', 'canceled', 'deleted', 'amanded', 'draft'])->default('created');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bupot');
    }
};
