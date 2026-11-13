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
        Schema::create('submission_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('submission_id')->constrained('submissions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('reviewer_id')->nullable()->constrained('users')->onUpdate('cascade')->onDelete('set null');
            $table->enum('action', ['submitted', 'approved', 'rejected', 'resubmitted']);
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['submission_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_reviews');
    }
};

