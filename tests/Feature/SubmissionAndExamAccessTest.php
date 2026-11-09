<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseSubmission;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\CourseUser;
use App\Models\Question;
use App\Models\QuestionBank;
use App\Models\QuestionOption;
use App\Models\Submission;
use App\Models\SubmissionReview;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class SubmissionAndExamAccessTest extends TestCase
{
    use DatabaseTransactions;

    private User $admin;
    private User $teacher;
    private User $otherTeacher;
    private User $student;
    private User $unenrolledStudent;
    private Course $course;
    private QuestionBank $questionBank;
    private CourseTest $testWithSubmission;
    private CourseTest $testWithoutSubmission;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'name' => 'Admin Test',
        ]);

        $this->teacher = User::factory()->create([
            'role' => 'pengajar',
            'name' => 'Teacher Main',
        ]);

        $this->otherTeacher = User::factory()->create([
            'role' => 'pengajar',
            'name' => 'Teacher Other',
        ]);

        $this->student = User::factory()->create([
            'role' => 'pengguna',
            'name' => 'Student Enrolled',
        ]);

        $this->unenrolledStudent = User::factory()->create([
            'role' => 'pengguna',
            'name' => 'Student Outside',
        ]);

        $this->course = Course::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $this->teacher->id,
            'name' => 'Pajak Lanjutan',
            'code' => 'TAX-' . Str::upper(Str::random(6)),
            'start_date' => now()->subDay(),
            'end_date' => now()->addDays(7),
        ]);

        // Enroll student to course
        CourseUser::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'user_id' => $this->student->id,
        ]);

        $this->questionBank = QuestionBank::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $this->teacher->id,
            'name' => 'Bank Soal Pajak',
            'is_active' => true,
        ]);

        // Add 2 questions
        for ($i = 1; $i <= 2; $i++) {
            $q = Question::create([
                'id' => (string) Str::uuid(),
                'question_bank_id' => $this->questionBank->id,
                'question_text' => "Pertanyaan {$i}",
                'question_type' => 'multiple_choice',
                'order_no' => $i,
            ]);

            QuestionOption::create([
                'id' => (string) Str::uuid(),
                'question_id' => $q->id,
                'option_text' => 'Benar',
                'is_correct' => true,
            ]);
            QuestionOption::create([
                'id' => (string) Str::uuid(),
                'question_id' => $q->id,
                'option_text' => 'Salah',
                'is_correct' => false,
            ]);
        }

        $this->testWithSubmission = CourseTest::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'question_bank_id' => $this->questionBank->id,
            'title' => 'Ujian Bersyarat Tugas',
            'duration' => 60,
            'passing_score' => 70,
            'max_attempts' => 1,
            'start_date' => now()->subHours(2),
            'end_date' => now()->addDays(2),
            'requires_submission' => true,
            'submission_instructions' => 'Wajib upload laporan praktikum.',
        ]);

        $this->testWithoutSubmission = CourseTest::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'question_bank_id' => $this->questionBank->id,
            'title' => 'Ujian Reguler Tanpa Tugas',
            'duration' => 60,
            'passing_score' => 70,
            'max_attempts' => 1,
            'start_date' => now()->subHours(2),
            'end_date' => now()->addDays(2),
            'requires_submission' => false,
        ]);
    }

    // ==========================================
    // 1. SUBMISSION TESTS
    // ==========================================

    public function test_student_can_submit_assignment_successfully(): void
    {
        $this->actingAs($this->student);

        $file = UploadedFile::fake()->create('tugas_pajak.pdf', 500, 'application/pdf');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
            'student_notes' => 'Tugas telah selesai dikerjakan.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('submissions', [
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'original_filename' => 'tugas_pajak.pdf',
            'status' => 'pending_review',
            'version' => 1,
        ]);

        $this->assertDatabaseHas('submission_reviews', [
            'action' => 'submitted',
            'notes' => 'Tugas telah selesai dikerjakan.',
        ]);
    }

    public function test_unenrolled_student_cannot_submit_assignment(): void
    {
        $this->actingAs($this->unenrolledStudent);

        $file = UploadedFile::fake()->create('tugas_ilegal.pdf', 100, 'application/pdf');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response->assertSessionHas('error', 'Anda tidak terdaftar di kelas ini.');
        $this->assertDatabaseMissing('submissions', [
            'user_id' => $this->unenrolledStudent->id,
        ]);
    }

    public function test_student_cannot_submit_for_exam_belonging_to_another_course(): void
    {
        $this->actingAs($this->student);

        $otherCourse = Course::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $this->teacher->id,
            'name' => 'Kelas Lain',
            'code' => 'TAX-OTHER',
        ]);

        CourseUser::create([
            'id' => (string) Str::uuid(),
            'course_id' => $otherCourse->id,
            'user_id' => $this->student->id,
        ]);

        $file = UploadedFile::fake()->create('tugas.pdf', 100, 'application/pdf');

        // Mismatched course and courseTest
        $response = $this->post(route('courses.courseTests.submissions.store', [
            $otherCourse->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response->assertStatus(404);
    }

    public function test_disallowed_file_extension_is_rejected(): void
    {
        $this->actingAs($this->student);

        $file = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response->assertSessionHasErrors(['file']);
    }

    public function test_file_exceeding_max_size_is_rejected(): void
    {
        $this->actingAs($this->student);

        // 25 MB exceeds 20480 KB limit
        $file = UploadedFile::fake()->create('large.pdf', 25600, 'application/pdf');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response->assertSessionHasErrors(['file']);
    }

    public function test_student_can_resubmit_when_rejected(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/old.pdf',
            'original_filename' => 'old.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'rejected',
            'admin_notes' => 'File tidak terbaca, mohon kirim ulang.',
            'version' => 1,
        ]);

        $this->actingAs($this->student);

        $file = UploadedFile::fake()->create('revisi_tugas.pdf', 600, 'application/pdf');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
            'student_notes' => 'Berikut revisi laporan tugas saya.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $submission->refresh();
        $this->assertEquals('pending_review', $submission->status);
        $this->assertEquals(2, $submission->version);
        $this->assertEquals('revisi_tugas.pdf', $submission->original_filename);

        $this->assertDatabaseHas('submission_reviews', [
            'submission_id' => $submission->id,
            'action' => 'resubmitted',
            'notes' => 'Berikut revisi laporan tugas saya.',
        ]);
    }

    public function test_student_cannot_resubmit_when_pending_or_approved(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
            'version' => 1,
        ]);

        $this->actingAs($this->student);
        $file = UploadedFile::fake()->create('another.pdf', 500, 'application/pdf');

        $response = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response->assertSessionHas('error', 'Submission Anda masih dalam proses peninjauan.');

        // Now test when approved
        $submission->update(['status' => 'approved']);
        $response2 = $this->post(route('courses.courseTests.submissions.store', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'file' => $file,
        ]);

        $response2->assertSessionHas('error', 'Submission Anda sudah disetujui.');
    }

    // ==========================================
    // 2. REVIEW TESTS (ADMIN & TEACHER)
    // ==========================================

    public function test_admin_can_view_all_submissions(): void
    {
        $this->actingAs($this->admin);

        $response = $this->get(route('admin.submissions.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_approve_submission(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
            'version' => 1,
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('submissions.approve', $submission->id));
        $response->assertSessionHas('success');

        $submission->refresh();
        $this->assertEquals('approved', $submission->status);
        $this->assertEquals($this->admin->id, $submission->reviewed_by);
        $this->assertNotNull($submission->reviewed_at);

        $this->assertDatabaseHas('submission_reviews', [
            'submission_id' => $submission->id,
            'reviewer_id' => $this->admin->id,
            'action' => 'approved',
        ]);
    }

    public function test_admin_can_reject_submission_with_mandatory_notes(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
            'version' => 1,
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('submissions.reject', $submission->id), [
            'admin_notes' => 'Laporan bab 3 belum dihitung pajaknya.',
        ]);

        $response->assertSessionHas('success');

        $submission->refresh();
        $this->assertEquals('rejected', $submission->status);
        $this->assertEquals('Laporan bab 3 belum dihitung pajaknya.', $submission->admin_notes);
        $this->assertEquals($this->admin->id, $submission->reviewed_by);
    }

    public function test_reject_without_notes_fails_validation(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        $this->actingAs($this->admin);

        $response = $this->post(route('submissions.reject', $submission->id), [
            'admin_notes' => '',
        ]);

        $response->assertSessionHasErrors(['admin_notes']);
    }

    public function test_teacher_can_review_own_course_submissions(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        $this->actingAs($this->teacher);

        $response = $this->post(route('submissions.approve', $submission->id));
        $response->assertSessionHas('success');

        $submission->refresh();
        $this->assertEquals('approved', $submission->status);
        $this->assertEquals($this->teacher->id, $submission->reviewed_by);
    }

    public function test_teacher_cannot_review_other_teacher_course_submissions(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        $this->actingAs($this->otherTeacher);

        $response = $this->post(route('submissions.approve', $submission->id));
        $response->assertStatus(403);
    }

    public function test_student_cannot_approve_own_submission(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        $this->actingAs($this->student);

        $response = $this->post(route('submissions.approve', $submission->id));
        $response->assertStatus(403);
    }

    // ==========================================
    // 3. EXAM ACCESS TESTS
    // ==========================================

    public function test_exam_without_submission_requirement_runs_normally(): void
    {
        $this->actingAs($this->student);

        $response = $this->post(route('courses.courseTests.start', [
            $this->course->id,
            $this->testWithoutSubmission->id,
        ]));

        $response->assertRedirect(route('courses.courseTests.exam', [
            $this->course->id,
            $this->testWithoutSubmission->id,
        ]));
    }

    public function test_student_without_submission_gets_403_when_required(): void
    {
        $this->actingAs($this->student);

        $response = $this->post(route('courses.courseTests.start', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));

        $response->assertStatus(403);
    }

    public function test_student_with_pending_submission_gets_403(): void
    {
        Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        $this->actingAs($this->student);

        $response = $this->post(route('courses.courseTests.start', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));

        $response->assertStatus(403);
    }

    public function test_student_with_rejected_submission_gets_403(): void
    {
        Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'rejected',
            'admin_notes' => 'Perbaiki lampiran.',
        ]);

        $this->actingAs($this->student);

        $response = $this->post(route('courses.courseTests.start', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));

        $response->assertStatus(403);
    }

    public function test_student_with_approved_submission_can_start_and_access_exam(): void
    {
        Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'approved',
            'reviewed_by' => $this->teacher->id,
            'reviewed_at' => now(),
        ]);

        $this->actingAs($this->student);

        $response = $this->post(route('courses.courseTests.start', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));

        $response->assertRedirect(route('courses.courseTests.exam', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));

        // Check direct access to exam page
        $examResponse = $this->get(route('courses.courseTests.exam', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]));
        $examResponse->assertStatus(200);
    }

    public function test_direct_api_bulk_answers_blocked_if_submission_not_approved(): void
    {
        $this->actingAs($this->student);

        $q = Question::where('question_bank_id', $this->questionBank->id)->first();

        $response = $this->postJson(route('courses.courseTests.answers.bulk', [
            $this->course->id,
            $this->testWithSubmission->id,
        ]), [
            'answers' => [
                ['question_id' => $q->id, 'answer' => 'benar'],
            ],
        ]);

        $response->assertStatus(403);
    }

    public function test_finished_attempt_is_retained_when_submission_rejected_later(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'approved',
        ]);

        // Student completed attempt previously
        $attempt = CourseTestAttempt::create([
            'id' => (string) Str::uuid(),
            'user_id' => $this->student->id,
            'course_test_id' => $this->testWithSubmission->id,
            'test_type' => 'exam',
            'score' => 85,
            'passed' => true,
            'started_at' => now()->subHour(),
            'submitted_at' => now()->subMinutes(10),
        ]);

        $this->actingAs($this->teacher);

        // Teacher revokes/rejects submission later
        $this->post(route('submissions.reject', $submission->id), [
            'admin_notes' => 'Ditemukan plagiasi tugas.',
        ]);

        $submission->refresh();
        $this->assertEquals('rejected', $submission->status);

        // Completed attempt remains intact!
        $this->assertDatabaseHas('course_test_attempts', [
            'id' => $attempt->id,
            'score' => 85,
            'passed' => true,
        ]);
    }

    public function test_active_open_attempt_is_safely_discarded_when_submission_rejected(): void
    {
        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'approved',
        ]);

        // Student has open active attempt (submitted_at IS NULL)
        $attempt = CourseTestAttempt::create([
            'id' => (string) Str::uuid(),
            'user_id' => $this->student->id,
            'course_test_id' => $this->testWithSubmission->id,
            'test_type' => 'exam',
            'score' => 0,
            'passed' => false,
            'started_at' => now(),
            'submitted_at' => null,
        ]);

        $this->actingAs($this->teacher);

        $this->post(route('submissions.reject', $submission->id), [
            'admin_notes' => 'Pembatalan izin ujian karena berkas salah.',
        ]);

        // Open in-progress attempt should be discarded safely
        $this->assertDatabaseMissing('course_test_attempts', [
            'id' => $attempt->id,
        ]);
    }

    public function test_teacher_can_create_multiple_course_submissions_in_course_detail(): void
    {
        $this->actingAs($this->teacher);

        // Create Task 1
        $response1 = $this->post(route('teacher.courseSubmissions.store', $this->course->id), [
            'title' => 'Tugas 1: Praktik PPN',
            'description' => 'Kerjakan SPT Masa PPN 1111 dengan benar.',
            'deadline' => now()->addDays(7)->format('Y-m-d H:i:s'),
        ]);
        $response1->assertRedirect();

        // Create Task 2
        $response2 = $this->post(route('teacher.courseSubmissions.store', $this->course->id), [
            'title' => 'Tugas 2: Upload Faktur Keluaran',
            'description' => 'Input 5 faktur keluaran dan upload filenya.',
            'deadline' => now()->addDays(14)->format('Y-m-d H:i:s'),
        ]);
        $response2->assertRedirect();

        $this->assertDatabaseHas('course_submissions', [
            'course_id' => $this->course->id,
            'title' => 'Tugas 1: Praktik PPN',
        ]);

        $this->assertDatabaseHas('course_submissions', [
            'course_id' => $this->course->id,
            'title' => 'Tugas 2: Upload Faktur Keluaran',
        ]);

        $this->assertEquals(2, CourseSubmission::where('course_id', $this->course->id)->count());
    }

    public function test_teacher_can_edit_course_submission(): void
    {
        $this->actingAs($this->teacher);

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Judul Lama',
            'description' => 'Deskripsi Lama',
        ]);

        $response = $this->put(route('teacher.courseSubmissions.update', [$this->course->id, $task->id]), [
            'title' => 'Judul Baru Diperbarui',
            'description' => 'Deskripsi Baru Diperbarui',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('course_submissions', [
            'id' => $task->id,
            'title' => 'Judul Baru Diperbarui',
            'description' => 'Deskripsi Baru Diperbarui',
        ]);
    }

    public function test_teacher_can_delete_course_submission(): void
    {
        $this->actingAs($this->teacher);

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Akan Dihapus',
        ]);

        $response = $this->delete(route('teacher.courseSubmissions.destroy', [$this->course->id, $task->id]));
        $response->assertRedirect();

        $this->assertDatabaseMissing('course_submissions', [
            'id' => $task->id,
        ]);
    }

    public function test_student_can_upload_submission_for_course_submission_task(): void
    {
        Storage::fake('local');

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Modul 1',
        ]);

        $this->actingAs($this->student);

        $fakeFile = UploadedFile::fake()->create('jawaban_tugas.pdf', 500, 'application/pdf');

        $response = $this->post(route('courses.submissions.storeCourseSubmission', [$this->course->id, $task->id]), [
            'file' => $fakeFile,
            'student_notes' => 'Berikut berkas tugas modul 1 saya Pak.',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'original_filename' => 'jawaban_tugas.pdf',
            'status' => 'pending_review',
            'student_notes' => 'Berikut berkas tugas modul 1 saya Pak.',
        ]);
    }

    public function test_teacher_can_acc_student_submission_from_course_detail(): void
    {
        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Modul 2',
        ]);

        $submission = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/tugas2.pdf',
            'original_filename' => 'tugas2.pdf',
            'file_size' => 2048,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        // Teacher approves (ACC) the student submission
        $this->actingAs($this->teacher);

        $response = $this->post(route('submissions.approve', $submission->id));
        $response->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'approved',
            'reviewed_by' => $this->teacher->id,
        ]);
    }

    public function test_exam_linked_to_course_submission_requires_acc_approval(): void
    {
        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Syarat Ujian Akhir',
        ]);

        $examWithSpecificSubmission = CourseTest::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'question_bank_id' => $this->questionBank->id,
            'title' => 'Ujian Akhir Bersyarat',
            'duration' => 60,
            'passing_score' => 70,
            'max_attempts' => 1,
            'requires_submission' => true,
            'course_submission_id' => $task->id,
        ]);

        // Student hasn't submitted -> 403 Forbidden
        $this->actingAs($this->student);
        $resForbidden = $this->post(route('courses.courseTests.start', [$this->course->id, $examWithSpecificSubmission->id]));
        $resForbidden->assertStatus(403);

        // Student creates submission
        $sub = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/final.pdf',
            'original_filename' => 'final.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        // Still pending -> 403 Forbidden
        $resPending = $this->post(route('courses.courseTests.start', [$this->course->id, $examWithSpecificSubmission->id]));
        $resPending->assertStatus(403);

        // Teacher ACCs submission
        $this->actingAs($this->teacher);
        $this->post(route('submissions.approve', $sub->id));

        // Now student can start exam -> 302 redirect to exam interface
        $this->actingAs($this->student);
        $resAllowed = $this->post(route('courses.courseTests.start', [$this->course->id, $examWithSpecificSubmission->id]));
        $resAllowed->assertRedirect(route('courses.courseTests.exam', [$this->course->id, $examWithSpecificSubmission->id]));
    }

    public function test_student_can_edit_submission_when_pending_before_deadline(): void
    {
        Storage::fake('local');

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Bisa Diedit',
            'deadline' => now()->addDays(3),
        ]);

        $sub = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/awal.pdf',
            'original_filename' => 'awal.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
            'version' => 1,
        ]);

        $this->actingAs($this->student);

        $newFile = UploadedFile::fake()->create('revisi_sebelum_acc.pdf', 800, 'application/pdf');

        $response = $this->post(route('courses.submissions.storeCourseSubmission', [$this->course->id, $task->id]), [
            'file' => $newFile,
            'student_notes' => 'Catatan revisi sebelum ACC.',
        ]);

        $response->assertRedirect();

        $sub->refresh();
        $this->assertEquals('revisi_sebelum_acc.pdf', $sub->original_filename);
        $this->assertEquals(2, $sub->version);
        $this->assertEquals('pending_review', $sub->status);
        $this->assertEquals('Catatan revisi sebelum ACC.', $sub->student_notes);

        $this->assertDatabaseHas('submission_reviews', [
            'submission_id' => $sub->id,
            'action' => 'resubmitted',
            'notes' => 'Catatan revisi sebelum ACC.',
        ]);
    }

    public function test_student_cannot_edit_submission_after_deadline(): void
    {
        Storage::fake('local');

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Lewat Deadline',
            'deadline' => now()->subDay(), // Deadline passed yesterday
        ]);

        $this->actingAs($this->student);

        $file = UploadedFile::fake()->create('terlambat.pdf', 500, 'application/pdf');

        $response = $this->post(route('courses.submissions.storeCourseSubmission', [$this->course->id, $task->id]), [
            'file' => $file,
        ]);

        $response->assertSessionHas('error', 'Batas waktu pengumpulan tugas ini telah berakhir.');
        $this->assertEquals(0, Submission::where('course_submission_id', $task->id)->count());
    }

    public function test_student_cannot_edit_submission_after_approved(): void
    {
        Storage::fake('local');

        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Sudah Di-ACC',
            'deadline' => now()->addDays(5),
        ]);

        $sub = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/acc.pdf',
            'original_filename' => 'acc.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'approved',
            'version' => 1,
        ]);

        $this->actingAs($this->student);

        $file = UploadedFile::fake()->create('coba_ganti_setelah_acc.pdf', 500, 'application/pdf');

        $response = $this->post(route('courses.submissions.storeCourseSubmission', [$this->course->id, $task->id]), [
            'file' => $file,
        ]);

        $response->assertSessionHas('error', 'Submission Anda sudah disetujui (ACC) dan tidak dapat diubah lagi.');
        $sub->refresh();
        $this->assertEquals('acc.pdf', $sub->original_filename);
    }

    public function test_teacher_and_student_can_preview_submission_inline(): void
    {
        Storage::fake('local');
        $stored = Storage::disk('local')->put('submissions/test_preview.pdf', '%PDF-1.4 test');

        $sub = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_test_id' => $this->testWithSubmission->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/test_preview.pdf',
            'original_filename' => 'test_preview.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        // Teacher can preview inline
        $this->actingAs($this->teacher);
        $resTeacher = $this->get(route('submissions.preview', $sub->id));
        $resTeacher->assertStatus(200);
        $resTeacher->assertHeader('Content-Disposition', 'inline; filename="test_preview.pdf"');

        // Student owner can preview inline
        $this->actingAs($this->student);
        $resStudent = $this->get(route('submissions.preview', $sub->id));
        $resStudent->assertStatus(200);
        $resStudent->assertHeader('Content-Disposition', 'inline; filename="test_preview.pdf"');

        // Other teacher cannot preview
        $this->actingAs($this->otherTeacher);
        $resOther = $this->get(route('submissions.preview', $sub->id));
        $resOther->assertStatus(403);
    }

    public function test_teacher_can_approve_all_students_for_course_submission(): void
    {
        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Uji ACC Semua',
        ]);

        // Student 1: submitted pending review
        $sub1 = Submission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'course_submission_id' => $task->id,
            'user_id' => $this->student->id,
            'file_path' => 'submissions/student1.pdf',
            'original_filename' => 'student1.pdf',
            'file_size' => 1024,
            'mime_type' => 'application/pdf',
            'status' => 'pending_review',
        ]);

        // Student 2: enrolled in course but has not submitted
        $student2 = User::factory()->create(['role' => 'pengguna', 'name' => 'Siswa Dua']);
        CourseUser::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'user_id' => $student2->id,
        ]);

        $this->actingAs($this->teacher);

        $response = $this->post(route('courses.submissions.approveAll', [$this->course->id, $task->id]), [
            'include_unsubmitted' => true,
        ]);

        $response->assertSessionHas('success');

        // Student 1 should be approved
        $sub1->refresh();
        $this->assertEquals('approved', $sub1->status);
        $this->assertEquals($this->teacher->id, $sub1->reviewed_by);

        // Student 2 should have an approved submission record created
        $sub2 = Submission::where('course_submission_id', $task->id)
            ->where('user_id', $student2->id)
            ->first();

        $this->assertNotNull($sub2);
        $this->assertEquals('approved', $sub2->status);
        $this->assertEquals($this->teacher->id, $sub2->reviewed_by);
    }

    public function test_other_teacher_cannot_approve_all_submissions(): void
    {
        $task = CourseSubmission::create([
            'id' => (string) Str::uuid(),
            'course_id' => $this->course->id,
            'title' => 'Tugas Lain',
        ]);

        $this->actingAs($this->otherTeacher);

        $response = $this->post(route('courses.submissions.approveAll', [$this->course->id, $task->id]), [
            'include_unsubmitted' => true,
        ]);

        $response->assertStatus(403);
    }
}
