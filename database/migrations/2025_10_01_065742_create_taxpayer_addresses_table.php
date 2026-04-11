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
        Schema::create('taxpayer_addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('taxpayer_identity_id')->constrained('taxpayer_identities')->onDelete('cascade');
            $table->string('address_type');
            $table->string('address_detail');
            $table->string('rt');
            $table->string('rw');
            $table->string('province');
            $table->string('region');
            $table->string('district');
            $table->string('sub_district');
            $table->string('region_code');
            $table->string('post_code');
            $table->string('geometric_data');
            $table->string('supervisory_section');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_addresses');
    }
};
