<?php

namespace App\Exports;

use App\Models\Course;
use App\Models\CourseTest;
use App\Models\CourseTestAttempt;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CourseTestParticipantsExport implements FromArray, WithHeadings, WithTitle
{
    protected $course;
    protected $courseTest;

    public function __construct(Course $course, CourseTest $courseTest)
    {
        $this->course = $course;
        $this->courseTest = $courseTest;
    }

    public function title(): string
    {
        return 'Peserta';
    }

    public function headings(): array
    {
        return ['No', 'Nama', 'Email', 'Nilai Terbaik', 'Keterangan'];
    }

    public function array(): array
    {
        $participants = $this->course->participants()
            ->with('user:id,name,email')
            ->get(['id', 'course_id', 'user_id']);

        $submittedAttempts = CourseTestAttempt::where('course_test_id', $this->courseTest->id)
            ->whereNotNull('submitted_at')
            ->get(['user_id', 'score']);

        $bestScoreByUser = $submittedAttempts
            ->groupBy('user_id')
            ->map(fn($attempts) => (int) $attempts->max('score'));

        $passingScore = (int) ($this->courseTest->passing_score ?? 0);

        $rows = [];
        $no = 1;

        foreach ($participants as $participant) {
            $userId = $participant->user_id;
            $hasBestScore = $bestScoreByUser->has($userId);
            $bestScore = $hasBestScore ? $bestScoreByUser->get($userId) : null;

            if ($bestScore === null) {
                $keterangan = 'Belum Mengerjakan';
            } elseif ($bestScore >= $passingScore) {
                $keterangan = 'Lulus';
            } else {
                $keterangan = 'Tidak Lulus';
            }

            $rows[] = [
                $no++,
                optional($participant->user)->name,
                optional($participant->user)->email,
                $bestScore,
                $keterangan,
            ];
        }

        return $rows;
    }
}
