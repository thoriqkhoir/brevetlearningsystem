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
        Schema::create('taxpayer_accountings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('taxpayer_identity_id')->constrained('taxpayer_identities')->onDelete('cascade');
            $table->string('accounting_method');
            $table->string('accounting_currency');
            $table->string('accounting_period');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_accountings');
    }
};
