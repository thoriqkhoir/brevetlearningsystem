<?php

namespace App\Exports;

use App\Models\Test;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class TestParticipantsExport implements FromArray, WithHeadings, WithTitle
{
    protected $test;

    public function __construct(Test $test)
    {
        $this->test = $test;
    }

    public function title(): string
    {
        return 'Peserta';
    }

    public function headings(): array
    {
        return ['No', 'Nama', 'Email', 'No. WA', 'Institusi', 'Nilai Terbaik', 'Feedback'];
    }

    public function array(): array
    {
        $participants = $this->test->participants()
            ->with(['user'])
            ->get();

        $rows = [];
        $no = 1;
        foreach ($participants as $p) {
            // best score via attempts (as in controller show/detail)
            $best = $p->best_score ?? null; // may be eager-calculated elsewhere
            if ($best === null) {
                $best = $this->test
                    ->testAttempts()
                    ->where('user_id', $p->user_id)
                    ->whereNotNull('submitted_at')
                    ->max('score');
                $best = $best !== null ? (int) $best : null;
            }

            $rows[] = [
                $no++,
                optional($p->user)->name,
                optional($p->user)->email,
                optional($p->user)->phone_number,
                optional($p->user)->institution,
                $best,
                $p->feedback,
            ];
        }
        return $rows;
    }
}
