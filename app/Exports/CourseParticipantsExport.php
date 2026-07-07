<?php

namespace App\Exports;

use App\Models\Course;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CourseParticipantsExport implements FromArray, WithHeadings, WithTitle
{
    protected $course;

    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    public function title(): string
    {
        return 'Peserta Kelas';
    }

    public function headings(): array
    {
        return [
            'No', 
            'Nama', 
            'Email', 
            'No. WA', 
            'NPWP', 
            'Alamat', 
            'Institusi', 
            'Rata-rata Nilai', 
            'Feedback'
        ];
    }

    public function array(): array
    {
        $participants = $this->course->participants()
            ->with(['user', 'courseResults'])
            ->get();

        $rows = [];
        $no = 1;

        foreach ($participants as $p) {
            $averageScore = null;
            if ($p->courseResults && $p->courseResults->count() > 0) {
                $validScores = $p->courseResults->whereNotNull('score')->pluck('score');
                if ($validScores->count() > 0) {
                    $averageScore = round($validScores->avg(), 2);
                }
            }

            $rows[] = [
                $no++,
                optional($p->user)->name,
                optional($p->user)->email,
                optional($p->user)->phone_number,
                optional($p->user)->npwp,
                optional($p->user)->address,
                optional($p->user)->institution,
                $averageScore !== null ? $averageScore : 'Belum dinilai',
                $p->feedback ?? '-',
            ];
        }

        return $rows;
    }
}
