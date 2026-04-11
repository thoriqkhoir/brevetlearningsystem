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
        Schema::create('master_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('category');
            $table->string('name');
            $table->enum('type', ['pribadi', 'badan', 'both', 'none'])->default('none');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_accounts');
    }
};
