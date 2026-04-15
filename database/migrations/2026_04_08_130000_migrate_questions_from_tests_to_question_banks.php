<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('questions', 'question_bank_id')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->uuid('question_bank_id')->nullable()->after('id');
            });
        }

        $now = now();

        // Ensure every existing test has a bank, then map each question to that bank.
        $tests = DB::table('tests')
            ->select('id', 'teacher_id', 'title', 'question_bank_id')
            ->get();

        foreach ($tests as $test) {
            $bankId = $test->question_bank_id;

            if (empty($bankId)) {
                $bankId = (string) Str::uuid();

                DB::table('question_banks')->insert([
                    'id' => $bankId,
                    'teacher_id' => $test->teacher_id,
                    'name' => 'Migrasi - ' . ($test->title ?? 'Bank Soal'),
                    'description' => 'Bank soal hasil migrasi otomatis dari ujian.',
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                DB::table('tests')
                    ->where('id', $test->id)
                    ->update([
                        'question_bank_id' => $bankId,
                        'updated_at' => $now,
                    ]);
            }

            DB::table('questions')
                ->where('test_id', $test->id)
                ->whereNull('question_bank_id')
                ->update([
                    'question_bank_id' => $bankId,
                    'updated_at' => $now,
                ]);
        }

        Schema::table('questions', function (Blueprint $table) {
            $table->foreign('question_bank_id')
                ->references('id')
                ->on('question_banks')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        if (Schema::hasColumn('questions', 'test_id')) {
            Schema::table('questions', function (Blueprint $table) {
                try {
                    $table->dropForeign(['test_id']);
                } catch (\Throwable $e) {
                    // Ignore if foreign key does not exist.
                }

                $table->dropColumn('test_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasColumn('questions', 'test_id')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->uuid('test_id')->nullable()->after('id');
            });

            // Best-effort remap: pick first test that uses the same bank.
            $questions = DB::table('questions')
                ->select('id', 'question_bank_id')
                ->get();

            foreach ($questions as $question) {
                $testId = DB::table('tests')
                    ->where('question_bank_id', $question->question_bank_id)
                    ->value('id');

                if ($testId) {
                    DB::table('questions')
                        ->where('id', $question->id)
                        ->update(['test_id' => $testId]);
                }
            }

            Schema::table('questions', function (Blueprint $table) {
                $table->foreign('test_id')
                    ->references('id')
                    ->on('tests')
                    ->onUpdate('cascade')
                    ->nullOnDelete();
            });
        }

        if (Schema::hasColumn('questions', 'question_bank_id')) {
            Schema::table('questions', function (Blueprint $table) {
                try {
                    $table->dropForeign(['question_bank_id']);
                } catch (\Throwable $e) {
                    // Ignore if foreign key does not exist.
                }

                $table->dropColumn('question_bank_id');
            });
        }
    }
};
