<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\TestAttemptAnswer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;
use Carbon\Carbon;

class ExamFlowTest extends TestCase
{
    use RefreshDatabase;

    private function makeMultipleChoiceTest(int $qCount = 5): array
    {
        $teacher = User::factory()->create();
        $student = User::factory()->create();

        $test = Test::create([
            'teacher_id'    => $teacher->id,
            'code'          => 'T-' . Str::upper(Str::random(6)),
            'title'         => 'MCQ Reliability Test',
            'description'   => null,
            'duration'      => 30,
            'passing_score' => 60,
            'start_date'    => null,
            'end_date'      => null,
        ]);

        $questions = collect();
        for ($i = 1; $i <= $qCount; $i++) {
            $q = Question::create([
                'test_id'       => $test->id,
                'question_text' => "Q{$i}",
                'question_type' => 'multiple_choice',
                'order_no'      => $i,
            ]);
            // 4 options, one correct
            $opts = collect();
            for ($j = 1; $j <= 4; $j++) {
                $opts->push(QuestionOption::create([
                    'question_id' => $q->id,
                    'option_text' => "Q{$i} Opt{$j}",
                    'is_correct'  => $j === 2, // mark option 2 as correct deterministically
                ]));
            }
            $q->setRelation('options', $opts);
            $questions->push($q);
        }

        return [$teacher, $student, $test, $questions];
    }

    public function test_bulk_save_and_submit_multiple_choice(): void
    {
        [$teacher, $student, $test, $questions] = $this->makeMultipleChoiceTest(6);

        $this->actingAs($student);

        // Prepare answers: alternate correct/wrong
        $payload = ['answers' => []];
        foreach ($questions as $idx => $q) {
            $correct = $q->options->firstWhere('is_correct', true);
            $wrong = $q->options->firstWhere('is_correct', false);
            $opt = ($idx % 2 === 0) ? $correct : $wrong; // even index correct
            $payload['answers'][] = [
                'question_id' => $q->id,
                'option_id'   => $opt->id,
            ];
        }

        // Bulk save
        $resp = $this->postJson(route('tests.answers.bulk', $test->id), $payload);
        $resp->assertStatus(200);
        $resp->assertJsonStructure(['message']);

        // Submit
        $submit = $this->post(route('tests.submit', $test->id));
        $submit->assertRedirect();

        // Verify data persisted
        $attempt = TestAttempt::where('user_id', $student->id)
            ->where('test_id', $test->id)
            ->latest('created_at')
            ->first();
        $this->assertNotNull($attempt, 'Attempt should exist');
        $this->assertNotNull($attempt->submitted_at, 'Attempt should be submitted');

        $savedCount = TestAttemptAnswer::where('test_attempt_id', $attempt->id)->count();
        $this->assertEquals($questions->count(), $savedCount, 'All answers must be saved');

        // Score should be 50% (3/6 correct)
        $this->assertSame(50, (int) $attempt->score);
    }

    public function test_bulk_after_deadline_is_accepted_and_finalized(): void
    {
        [$teacher, $student, $test, $questions] = $this->makeMultipleChoiceTest(4);

        $this->actingAs($student);

        // Create attempt with started_at far in the past so duration has elapsed
        $attempt = TestAttempt::create([
            'user_id'     => $student->id,
            'test_id'     => $test->id,
            'test_type'   => 'exam',
            'score'       => 0,
            'passed'      => false,
            'started_at'  => now()->subMinutes($test->duration + 1),
            'submitted_at'=> null,
        ]);

        $payload = ['answers' => []];
        foreach ($questions as $q) {
            $correct = $q->options->firstWhere('is_correct', true);
            $payload['answers'][] = [
                'question_id' => $q->id,
                'option_id'   => $correct->id,
            ];
        }

        // Bulk save after deadline — controller should accept and finalize
        $resp = $this->postJson(route('tests.answers.bulk', $test->id), $payload);
        $resp->assertStatus(200);
        $resp->assertJsonStructure(['message']);

        $attempt->refresh();
        $this->assertNotNull($attempt->submitted_at, 'Attempt should be auto submitted after deadline');

        $savedCount = TestAttemptAnswer::where('test_attempt_id', $attempt->id)->count();
        $this->assertEquals($questions->count(), $savedCount, 'All answers must be saved even after deadline');

        // All correct => 100
        $this->assertSame(100, (int) $attempt->score);
    }
}
