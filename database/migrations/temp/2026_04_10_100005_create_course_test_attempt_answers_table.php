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
        Schema::create('course_test_attempt_answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('question_id')->constrained('questions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('course_test_attempt_id')->constrained('course_test_attempts')->onUpdate('cascade')->onDelete('cascade');
            $table->text('answer')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->unique(['course_test_attempt_id', 'question_id'], 'cta_answer_attempt_question_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_test_attempt_answers');
    }
};
