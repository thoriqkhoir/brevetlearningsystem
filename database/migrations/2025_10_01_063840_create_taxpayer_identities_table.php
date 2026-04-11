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
        Schema::create('taxpayer_identities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nik')->unique();
            $table->string('npwp')->nullable()->unique();
            $table->string('name');
            $table->string('type');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('country');
            $table->string('gender');
            $table->string('marital_status');
            $table->string('religion');
            $table->string('occupation');
            $table->string('mother_name');
            $table->string('family_card_number');
            $table->string('family_relationship_status');
            $table->string('individual_category')->nullable();
            $table->string('photo')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('mobile_phone_number')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('fax_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxpayer_identities');
    }
};
