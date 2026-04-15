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
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration')->default(0);
            $table->integer('passing_score')->default(0);
            $table->integer('questions_to_show')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->boolean('show_score')->default(true);
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
