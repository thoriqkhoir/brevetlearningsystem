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
        Schema::create('spt_op_l_3b', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_op_id')->constrained('spt_op')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('tku_id')->constrained('master_tku')->onUpdate('cascade')->onDelete('restrict');
            $table->enum('bruto_type', ['a', 'b', 'c'])->nullable();
            $table->string('type_of_bookkeeping')->nullable();
            $table->string('business_type')->nullable();
            $table->integer('januari')->default(0);
            $table->integer('februari')->default(0);
            $table->integer('maret')->default(0);
            $table->integer('april')->default(0);
            $table->integer('mei')->default(0);
            $table->integer('juni')->default(0);
            $table->integer('juli')->default(0);
            $table->integer('agustus')->default(0);
            $table->integer('september')->default(0);
            $table->integer('oktober')->default(0);
            $table->integer('november')->default(0);
            $table->integer('desember')->default(0);
            $table->integer('accumulated')->default(0);
            $table->integer('total')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op_l_3b');
    }
};
