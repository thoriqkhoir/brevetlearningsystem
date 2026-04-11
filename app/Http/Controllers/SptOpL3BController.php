<?php

namespace App\Http\Controllers;

use App\Models\SptOp;
use App\Models\SptOpL3A4A;
use App\Models\SptOpL3A4B;
use App\Models\SptOpL3B;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SptOpL3BController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'spt_op_id' => ['required', 'uuid'],
            'rows' => ['present', 'array'],
            'rows.*.id' => ['nullable', 'uuid'],
            'rows.*.tku_id' => ['required', 'integer', 'exists:master_tku,id'],
            'rows.*.bruto_type' => ['required', Rule::in(['a', 'b', 'c'])],
            'rows.*.type_of_bookkeeping' => ['nullable', 'string', 'max:255'],
            'rows.*.business_type' => ['nullable', 'string', 'max:255'],
            'rows.*.januari' => ['nullable', 'integer', 'min:0'],
            'rows.*.februari' => ['nullable', 'integer', 'min:0'],
            'rows.*.maret' => ['nullable', 'integer', 'min:0'],
            'rows.*.april' => ['nullable', 'integer', 'min:0'],
            'rows.*.mei' => ['nullable', 'integer', 'min:0'],
            'rows.*.juni' => ['nullable', 'integer', 'min:0'],
            'rows.*.juli' => ['nullable', 'integer', 'min:0'],
            'rows.*.agustus' => ['nullable', 'integer', 'min:0'],
            'rows.*.september' => ['nullable', 'integer', 'min:0'],
            'rows.*.oktober' => ['nullable', 'integer', 'min:0'],
            'rows.*.november' => ['nullable', 'integer', 'min:0'],
            'rows.*.desember' => ['nullable', 'integer', 'min:0'],
        ]);

        $sptOpId = $validated['spt_op_id'];

        SptOpL3B::where('spt_op_id', $sptOpId)->delete();

        foreach ($validated['rows'] as $row) {
            $months = [
                'januari' => (int)($row['januari'] ?? 0),
                'februari' => (int)($row['februari'] ?? 0),
                'maret' => (int)($row['maret'] ?? 0),
                'april' => (int)($row['april'] ?? 0),
                'mei' => (int)($row['mei'] ?? 0),
                'juni' => (int)($row['juni'] ?? 0),
                'juli' => (int)($row['juli'] ?? 0),
                'agustus' => (int)($row['agustus'] ?? 0),
                'september' => (int)($row['september'] ?? 0),
                'oktober' => (int)($row['oktober'] ?? 0),
                'november' => (int)($row['november'] ?? 0),
                'desember' => (int)($row['desember'] ?? 0),
            ];

            $total = array_sum($months);
            $accumulated = $total;

            SptOpL3B::create([
                'spt_op_id' => $sptOpId,
                'tku_id' => (int)$row['tku_id'],
                'bruto_type' => $row['bruto_type'],
                'type_of_bookkeeping' => $row['type_of_bookkeeping'] ?? null,
                'business_type' => $row['business_type'] ?? null,
                ...$months,
                'accumulated' => $accumulated,
                'total' => $total,
            ]);
        }

        // Sync L3A4A from L3B section B and C (tku_id=8 is the user's TKU)
        $this->syncL3A4AFromL3B($sptOpId, $validated['rows']);

        return back();
    }

    /**
     * Sync L3A4A record from L3B section C (NPPN).
     * Hanya satu baris yang disimpan di L3A4A sebagai rekap total peredaran bruto.
     */
    private function syncL3A4AFromL3B(string $sptOpId, array $rows): void
    {
        // Ambil norma yang sudah pernah disimpan (jika ada) agar tetap dipertahankan
        $existing = SptOpL3A4A::where('spt_op_id', $sptOpId)->first();
        $existingNorma = (int) optional($existing)->norma;

        // Hapus semua record L3A4A untuk SPT OP ini (akan dibuat ulang sebagai satu baris)
        SptOpL3A4A::where('spt_op_id', $sptOpId)->delete();

        // Filter rows dengan bruto_type 'c' (Lampiran 3 Bagian C) dan tku_id=8 (TKU Wajib Pajak)
        $userTkuId = 8;
        $relevantRows = array_filter($rows, function ($row) use ($userTkuId) {
            return $row['bruto_type'] === 'c' && (int) $row['tku_id'] === $userTkuId;
        });

        // Hitung total peredaran bruto dari semua baris relevan
        $months = [
            'januari',
            'februari',
            'maret',
            'april',
            'mei',
            'juni',
            'juli',
            'agustus',
            'september',
            'oktober',
            'november',
            'desember',
        ];

        $grossIncome = 0;
        $businessType = null;

        foreach ($relevantRows as $row) {
            foreach ($months as $m) {
                $grossIncome += (int) ($row[$m] ?? 0);
            }

            // Ambil jenis usaha pertama yang tersedia
            if ($businessType === null && !empty($row['business_type'])) {
                $businessType = $row['business_type'];
            }
        }

        // Jika tidak ada peredaran bruto, cukup update b_1c_value menjadi 0
        if ($grossIncome > 0) {
            $netIncome = (int) round($grossIncome * $existingNorma / 100);

            SptOpL3A4A::create([
                'spt_op_id' => $sptOpId,
                'business_place' => null,
                'business_type' => $businessType,
                'gross_income' => $grossIncome,
                'norma' => $existingNorma,
                'net_income' => $netIncome,
            ]);
        }

        // Update b_1c_value (penghasilan neto) on SptOp from totals in Lampiran 3A-4 A & B
        $this->updateSptOpB1cValue($sptOpId);
    }

    /**
     * Update B.1c value (penghasilan neto) on SptOp from totals in Lampiran 3A-4 A & B.
     */
    private function updateSptOpB1cValue(string $sptOpId): void
    {
        $totalNetA = (int) SptOpL3A4A::where('spt_op_id', $sptOpId)->sum('net_income');
        $totalNetB = (int) SptOpL3A4B::where('spt_op_id', $sptOpId)->sum('net_income');

        SptOp::where('id', $sptOpId)->update([
            'b_1c_value' => $totalNetA + $totalNetB,
        ]);
    }
}
