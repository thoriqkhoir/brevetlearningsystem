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
        Schema::table('billings', function (Blueprint $table) {
            // Mengubah kolom billing_form_id menjadi nullable jika belum
            $table->uuid('billing_form_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('billings', function (Blueprint $table) {
            // Mengembalikan kolom billing_form_id menjadi tidak nullable
            $table->uuid('billing_form_id')->nullable(false)->change();
        });
    }
};
