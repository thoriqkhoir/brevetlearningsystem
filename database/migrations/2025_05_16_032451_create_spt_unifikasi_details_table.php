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
        Schema::create('spt_unifikasi_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_unifikasi_id')->constrained('spt_unifikasi')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tab_type'); // 'tabI', 'tabII', 'tabLampiran'
            
            // Fields untuk TabI (BUPOT)
            $table->string('npwp')->nullable();
            $table->string('name')->nullable();
            $table->string('doc_no')->nullable();
            $table->date('doc_date')->nullable();
            $table->string('tax_type')->nullable();
            $table->string('tax_code')->nullable();
            $table->string('tax_name')->nullable();
            $table->bigInteger('dpp')->default(0);
            $table->decimal('tarif', 8, 4)->default(0); // Format desimal untuk tarif
            $table->bigInteger('tax')->default(0);
            $table->string('facility')->nullable();
            
            // Fields untuk TabII dan TabLampiran
            $table->text('description')->nullable();
            
            // Tambahkan field lain yang mungkin diperlukan
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_unifikasi_details');
    }
};