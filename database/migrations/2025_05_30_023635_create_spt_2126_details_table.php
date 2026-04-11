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
        Schema::create('spt_2126_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt2126_id')->constrained('spt_2126')->onUpdate('cascade')->onDelete('cascade');
            $table->string('tab_type');
            $table->string('npwp')->nullable();
            $table->string('name')->nullable();
            $table->string('tax_type')->nullable();
            $table->string('doc_no')->nullable();
            $table->date('doc_date')->nullable();
            $table->string('tax_code')->nullable();
            $table->string('tax_name')->nullable();
            $table->bigInteger('dpp')->nullable();
            $table->decimal('tarif', 8, 4)->default(0);
            $table->bigInteger('tax')->default(0);
            $table->string('facility')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_2126_details');
    }
};
