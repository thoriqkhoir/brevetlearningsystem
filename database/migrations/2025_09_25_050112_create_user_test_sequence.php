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
        Schema::create('user_test_sequences', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('test_id');
            $table->string('test_type'); 
            $table->json('question_sequence'); 
            $table->json('option_sequences'); 
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('test_id')->references('id')->on('tests')->onDelete('cascade');
            $table->unique(['user_id', 'test_id', 'test_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_test_sequence');
    }
};
