<?php

namespace Tests\Feature;

use App\Imports\UserImport;
use App\Models\Course;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use App\Models\CourseUser;
use App\Models\Event;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PlatformApiTest extends TestCase
{
    use RefreshDatabase;

    private function ensureEventExists(): Event
    {
        return Event::firstOrCreate(
            ['id' => 1],
            ['code' => 'PUB001', 'name' => 'Public']
        );
    }

    public function test_platform_token_can_access_profile(): void
    {
        $this->ensureEventExists();

        $platform = Platform::create([
            'name' => 'Platform Alpha',
            'code' => 'platform-alpha-' . Str::random(5),
            'is_active' => true,
        ]);

        $token = $platform->createToken('Test Token', ['platform:read'])->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/platform/profile');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $platform->id,
                    'name' => 'Platform Alpha',
                    'is_active' => true,
                ],
            ]);
    }

    public function test_platform_token_can_access_only_own_students(): void
    {
        $this->ensureEventExists();

        $platformA = Platform::create([
            'name' => 'Platform A',
            'code' => 'plat-a-' . Str::random(5),
            'is_active' => true,
        ]);

        $platformB = Platform::create([
            'name' => 'Platform B',
            'code' => 'plat-b-' . Str::random(5),
            'is_active' => true,
        ]);

        $studentA = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformA->id,
            'name' => 'Student Platform A',
            'email' => 'student_a_' . Str::random(5) . '@test.com',
            'phone_number' => '081211111111',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $studentB = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformB->id,
            'name' => 'Student Platform B',
            'email' => 'student_b_' . Str::random(5) . '@test.com',
            'phone_number' => '081222222222',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $tokenA = $platformA->createToken('Token A', ['platform:read'])->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/students');

        $response->assertStatus(200);
        $data = $response->json('data');
        $emails = collect($data)->pluck('email')->all();

        $this->assertContains($studentA->email, $emails);
        $this->assertNotContains($studentB->email, $emails);
    }

    public function test_platform_token_cannot_access_other_platform_student_detail(): void
    {
        $this->ensureEventExists();

        $platformA = Platform::create([
            'name' => 'Platform A2',
            'code' => 'plat-a2-' . Str::random(5),
            'is_active' => true,
        ]);

        $platformB = Platform::create([
            'name' => 'Platform B2',
            'code' => 'plat-b2-' . Str::random(5),
            'is_active' => true,
        ]);

        $studentB = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformB->id,
            'name' => 'Student B2',
            'email' => 'student_b2_' . Str::random(5) . '@test.com',
            'phone_number' => '081233333333',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $tokenA = $platformA->createToken('Token A2', ['platform:read'])->plainTextToken;

        // Platform A tries to access Student B detail -> should 404
        $response = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/students/' . $studentB->id);

        $response->assertStatus(404);
    }

    public function test_inactive_platform_token_is_rejected(): void
    {
        $this->ensureEventExists();

        $platformInactive = Platform::create([
            'name' => 'Platform Inactive',
            'code' => 'plat-inact-' . Str::random(5),
            'is_active' => false,
        ]);

        $token = $platformInactive->createToken('Token Inact', ['platform:read'])->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/platform/profile');

        $response->assertStatus(403);
    }

    public function test_user_import_conflict_policy(): void
    {
        $this->ensureEventExists();

        $platform1 = Platform::create([
            'name' => 'Platform Import 1',
            'code' => 'plat-imp-1-' . Str::random(5),
            'is_active' => true,
        ]);

        $platform2 = Platform::create([
            'name' => 'Platform Import 2',
            'code' => 'plat-imp-2-' . Str::random(5),
            'is_active' => true,
        ]);

        $importHandler1 = new UserImport($platform1->id);

        // 1. Create new user with platform1
        $emailNew = 'import_new_' . Str::random(5) . '@test.com';
        $importHandler1->model([
            'name' => 'Import User 1',
            'email' => $emailNew,
            'phone_number' => '081299990001',
        ]);

        $user1 = User::where('email', $emailNew)->first();
        $this->assertNotNull($user1);
        $this->assertEquals($platform1->id, $user1->platform_id);

        // 2. Existing user with NULL platform_id claimed by platform1
        $emailNullPlatform = 'import_null_' . Str::random(5) . '@test.com';
        $userNull = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => null,
            'name' => 'Null Platform User',
            'email' => $emailNullPlatform,
            'phone_number' => '081299990002',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $importHandler1->model([
            'name' => 'Null Platform User',
            'email' => $emailNullPlatform,
            'phone_number' => '081299990002',
        ]);

        $userNull->refresh();
        $this->assertEquals($platform1->id, $userNull->platform_id);

        // 3. Existing user with platform1 imported with platform2 (cross-platform conflict) -> skipped
        $importHandler2 = new UserImport($platform2->id);
        $importHandler2->model([
            'name' => 'Attacker trying to steal user',
            'email' => $user1->email,
            'phone_number' => '081299990001',
        ]);

        $user1->refresh();
        $this->assertEquals($platform1->id, $user1->platform_id); // Remains platform1!
    }

    public function test_platform_token_can_access_only_own_exam_results(): void
    {
        $this->ensureEventExists();

        $platformA = Platform::create([
            'name' => 'Platform Exam A',
            'code' => 'plat-ex-a-' . Str::random(5),
            'is_active' => true,
        ]);

        $platformB = Platform::create([
            'name' => 'Platform Exam B',
            'code' => 'plat-ex-b-' . Str::random(5),
            'is_active' => true,
        ]);

        $studentA = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformA->id,
            'name' => 'Student Exam A',
            'email' => 'student_exam_a_' . Str::random(5) . '@test.com',
            'phone_number' => '081277771111',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $studentB = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformB->id,
            'name' => 'Student Exam B',
            'email' => 'student_exam_b_' . Str::random(5) . '@test.com',
            'phone_number' => '081277772222',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $teacher = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'name' => 'Teacher Exam',
            'email' => 'teacher_exam_' . Str::random(5) . '@test.com',
            'phone_number' => '081277770000',
            'role' => 'pengajar',
            'password' => bcrypt('secret'),
        ]);

        $course = Course::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $teacher->id,
            'name' => 'Course Pajak 101',
            'code' => 'TAX101-' . Str::random(4),
        ]);

        $questionBank = \App\Models\QuestionBank::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $teacher->id,
            'name' => 'Bank Soal Ujian',
        ]);

        $courseTest = CourseTest::create([
            'id' => (string) Str::uuid(),
            'course_id' => $course->id,
            'question_bank_id' => $questionBank->id,
            'title' => 'Ujian Tengah Semester',
            'passing_score' => 75,
        ]);

        $attemptA = CourseTestAttempt::create([
            'id' => (string) Str::uuid(),
            'user_id' => $studentA->id,
            'course_test_id' => $courseTest->id,
            'score' => 90,
            'passed' => true,
            'started_at' => now()->subHour(),
            'submitted_at' => now(),
        ]);

        $attemptB = CourseTestAttempt::create([
            'id' => (string) Str::uuid(),
            'user_id' => $studentB->id,
            'course_test_id' => $courseTest->id,
            'score' => 60,
            'passed' => false,
            'started_at' => now()->subHour(),
            'submitted_at' => now(),
        ]);

        $tokenA = $platformA->createToken('Token Exam A', ['platform:read'])->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/exam-results');

        $response->assertStatus(200);
        $data = $response->json('data');
        $attemptIds = collect($data)->pluck('attempt_id')->all();

        $this->assertContains($attemptA->id, $attemptIds);
        $this->assertNotContains($attemptB->id, $attemptIds);
    }

    public function test_admin_can_access_platforms_page_and_crud(): void
    {
        $this->ensureEventExists();

        $admin = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'name' => 'Super Admin',
            'email' => 'admin_plat_' . Str::random(5) . '@test.com',
            'phone_number' => '081299998888',
            'role' => 'admin',
            'password' => bcrypt('secret'),
        ]);

        // 1. Admin can access /admin/platforms
        $this->withoutVite();
        $response = $this->actingAs($admin)->get('/admin/platforms');
        $response->assertStatus(200);

        // 2. Admin can create platform
        $platformName = 'Platform Baru ' . Str::random(6);
        $postResponse = $this->actingAs($admin)->post('/admin/platforms', [
            'name' => $platformName,
            'code' => 'platform-baru-' . Str::random(4),
            'description' => 'Platform untuk tes',
            'is_active' => true,
        ]);
        $postResponse->assertRedirect();

        $createdPlatform = Platform::where('name', $platformName)->first();
        $this->assertNotNull($createdPlatform);
        $this->assertTrue($createdPlatform->is_active);

        // 3. Admin can toggle status
        $toggleResponse = $this->actingAs($admin)->post("/admin/platforms/{$createdPlatform->id}/toggle-status");
        $toggleResponse->assertRedirect();
        $createdPlatform->refresh();
        $this->assertFalse($createdPlatform->is_active);

        // 4. Admin can generate token
        $genResponse = $this->actingAs($admin)->post("/admin/platforms/{$createdPlatform->id}/generate-token");
        $genResponse->assertSessionHas('plainTextToken');
        $this->assertCount(1, $createdPlatform->tokens);

        // 5. Admin can revoke token
        $revokeResponse = $this->actingAs($admin)->post("/admin/platforms/{$createdPlatform->id}/revoke-tokens");
        $revokeResponse->assertRedirect();
        $this->assertCount(0, $createdPlatform->fresh()->tokens);
    }

    public function test_platform_can_list_only_courses_with_its_students(): void
    {
        $this->ensureEventExists();

        $platformA = Platform::create([
            'name' => 'Platform Course A',
            'code' => 'plat-c-a-' . Str::random(5),
            'is_active' => true,
        ]);

        $platformB = Platform::create([
            'name' => 'Platform Course B',
            'code' => 'plat-c-b-' . Str::random(5),
            'is_active' => true,
        ]);

        $teacher = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'name' => 'Teacher One',
            'email' => 'teacher_c_' . Str::random(5) . '@test.com',
            'phone_number' => '081255550001',
            'role' => 'pengajar',
            'password' => bcrypt('secret'),
        ]);

        $course1 = Course::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $teacher->id,
            'name' => 'Kelas Pajak A',
            'code' => 'KP-A-' . Str::random(4),
        ]);

        $course2 = Course::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $teacher->id,
            'name' => 'Kelas Pajak B',
            'code' => 'KP-B-' . Str::random(4),
        ]);

        $studentA = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformA->id,
            'name' => 'Student A Enrolled',
            'email' => 'student_ca_' . Str::random(5) . '@test.com',
            'phone_number' => '081255550002',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        $studentB = User::create([
            'id' => (string) Str::uuid(),
            'event_id' => 1,
            'platform_id' => $platformB->id,
            'name' => 'Student B Enrolled',
            'email' => 'student_cb_' . Str::random(5) . '@test.com',
            'phone_number' => '081255550003',
            'role' => 'pengguna',
            'password' => bcrypt('secret'),
        ]);

        // Enroll Student A in Course 1
        CourseUser::create([
            'id' => (string) Str::uuid(),
            'course_id' => $course1->id,
            'user_id' => $studentA->id,
        ]);

        // Enroll Student B in Course 2
        CourseUser::create([
            'id' => (string) Str::uuid(),
            'course_id' => $course2->id,
            'user_id' => $studentB->id,
        ]);

        $tokenA = $platformA->createToken('Token Course A', ['platform:read'])->plainTextToken;

        // Platform A requests courses
        $response = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/courses');

        $response->assertStatus(200);
        $courseIds = collect($response->json('data'))->pluck('id')->all();

        $this->assertContains($course1->id, $courseIds);
        $this->assertNotContains($course2->id, $courseIds);
        $this->assertEquals(1, $response->json('data.0.students_count'));

        // Test show course detail
        $showResp = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/courses/' . $course1->id);

        $showResp->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $course1->id,
                    'name' => 'Kelas Pajak A',
                    'students_count' => 1,
                ],
            ]);

        // Platform A tries to access Course 2 (which has no students from Platform A) -> 404
        $forbiddenCourseResp = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/courses/' . $course2->id);
        $forbiddenCourseResp->assertStatus(404);

        // Test students inside course
        $studentsResp = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/courses/' . $course1->id . '/students');

        $studentsResp->assertStatus(200);
        $studentEmails = collect($studentsResp->json('data'))->pluck('student.email')->all();
        $this->assertContains($studentA->email, $studentEmails);
        $this->assertNotContains($studentB->email, $studentEmails);

        // Test course tests list inside course
        $questionBank = \App\Models\QuestionBank::create([
            'id' => (string) Str::uuid(),
            'teacher_id' => $teacher->id,
            'name' => 'Bank Soal Course A',
        ]);

        $test1 = CourseTest::create([
            'id' => (string) Str::uuid(),
            'course_id' => $course1->id,
            'question_bank_id' => $questionBank->id,
            'title' => 'Ujian Akhir Semester',
            'duration' => 60,
            'passing_score' => 80,
        ]);

        $testsResp = $this->withHeader('Authorization', 'Bearer ' . $tokenA)
            ->getJson('/api/v1/platform/courses/' . $course1->id . '/tests');

        $testsResp->assertStatus(200)
            ->assertJson([
                'success' => true,
                'course' => [
                    'id' => $course1->id,
                    'name' => 'Kelas Pajak A',
                ],
                'data' => [
                    [
                        'id' => $test1->id,
                        'title' => 'Ujian Akhir Semester',
                        'duration' => 60,
                        'passing_score' => 80,
                    ],
                ],
            ]);
    }
}
