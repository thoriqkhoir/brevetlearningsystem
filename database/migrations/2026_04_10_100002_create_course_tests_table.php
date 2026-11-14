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
        Schema::create('course_tests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('course_id')->constrained('courses')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('question_bank_id')->constrained('question_banks')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('course_submission_id')->nullable()->constrained('course_submissions')->onUpdate('cascade')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('reference_link')->nullable();
            $table->integer('duration')->default(0);
            $table->integer('passing_score')->default(0);
            $table->integer('questions_to_show')->nullable();
            $table->integer('max_attempts')->default(0);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->boolean('show_score')->default(true);
            $table->boolean('show_correct_answers')->default(true);
            $table->boolean('remedial_enabled')->default(false);
            $table->timestamp('remedial_end_date')->nullable();
            $table->boolean('requires_submission')->default(false);
            $table->text('submission_instructions')->nullable();
            $table->timestamps();

            $table->index(['course_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_tests');
    }
};
