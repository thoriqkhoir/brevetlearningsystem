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
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('course_id')->constrained('courses')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('course_submission_id')->nullable()->constrained('course_submissions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('course_test_id')->nullable()->constrained('course_tests')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('course_module_id')->nullable()->constrained('course_modules')->onUpdate('cascade')->onDelete('set null');
            $table->foreignUuid('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');

            $table->string('file_path');
            $table->string('original_filename');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            $table->text('student_notes')->nullable();

            $table->enum('status', ['pending_review', 'approved', 'rejected'])->default('pending_review');
            $table->text('admin_notes')->nullable();

            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->onUpdate('cascade')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();

            $table->unsignedInteger('version')->default(1);
            $table->timestamps();

            $table->unique(['course_submission_id', 'user_id'], 'sub_course_submission_user_unique');
            $table->unique(['course_test_id', 'user_id'], 'sub_course_test_user_unique');
            $table->index(['course_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};

