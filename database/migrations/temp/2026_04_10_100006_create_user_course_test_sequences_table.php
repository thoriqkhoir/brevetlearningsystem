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
        Schema::create('user_course_test_sequences', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('course_test_id');
            $table->string('test_type')->default('exam');
            $table->json('question_sequence');
            $table->json('option_sequences');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_test_id')->references('id')->on('course_tests')->onDelete('cascade');
            $table->unique(['user_id', 'course_test_id', 'test_type'], 'ucts_user_test_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_course_test_sequences');
    }
};
