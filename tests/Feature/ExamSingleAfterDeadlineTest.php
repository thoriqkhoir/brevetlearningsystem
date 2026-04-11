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

class ExamSingleAfterDeadlineTest extends TestCase
{
    use RefreshDatabase;

    public function test_single_saves_after_deadline_then_submit_persists_all(): void
    {
        $teacher = User::factory()->create();
        $student = User::factory()->create();

        $test = Test::create([
            'teacher_id'    => $teacher->id,
            'code'          => 'TS-' . Str::upper(Str::random(6)),
            'title'         => 'Single After Deadline',
            'duration'      => 10,
            'passing_score' => 0,
        ]);

        // Create 3 MCQ questions
        $questions = collect();
        for ($i=1; $i<=3; $i++) {
            $q = Question::create([
                'test_id' => $test->id,
                'question_text' => 'Q'.$i,
                'question_type' => 'multiple_choice',
                'order_no' => $i,
            ]);
            $opts = collect();
            for ($j=1; $j<=4; $j++) {
                $opts->push(QuestionOption::create([
                    'question_id' => $q->id,
                    'option_text' => "Q{$i} Opt{$j}",
                    'is_correct' => $j===1,
                ]));
            }
            $q->setRelation('options', $opts);
            $questions->push($q);
        }

        $this->actingAs($student);

        // Create attempt that is already past duration so controller marks afterDeadline=true
        $attempt = TestAttempt::create([
            'user_id' => $student->id,
            'test_id' => $test->id,
            'test_type' => 'exam',
            'started_at' => now()->subMinutes(20),
        ]);

        // Post single answers for two questions (simulate fallback singles at deadline)
        foreach ($questions->take(2) as $q) {
            $opt = $q->options->firstWhere('is_correct', true);
            $resp = $this->postJson(route('tests.answer', $test->id), [
                'question_id' => $q->id,
                'option_id' => $opt->id,
            ]);
            $resp->assertStatus(200);
        }

        // Now finalize explicitly by calling submit
        $submit = $this->post(route('tests.submit', $test->id));
        $submit->assertRedirect();

        $attempt->refresh();
        $this->assertNotNull($attempt->submitted_at, 'Attempt should be submitted on explicit submit');

        // Ensure both answers persisted in the same (original) attempt
        $saved = TestAttemptAnswer::where('test_attempt_id', $attempt->id)->count();
        $this->assertSame(2, $saved, 'Both single-saved answers should be on the same attempt');
    }
}
