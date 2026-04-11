<?php

namespace App\Http\Controllers;

use App\Models\MasterAccount;
use App\Models\SptBadan;
use App\Models\SptBadanL1A;
use Illuminate\Http\Request;

class SptBadanL1AController extends Controller
{
    public function syncL1A1(Request $request)
    {
        return $this->syncByCode($request, 'a');
    }

    public function syncL1B1(Request $request)
    {
        return $this->syncByCode($request, 'b');
    }

    public function syncL1C1(Request $request)
    {
        return $this->syncByCode($request, 'c');
    }

    public function syncL1D1(Request $request)
    {
        return $this->syncByCode($request, 'd');
    }

    public function syncL1E1(Request $request)
    {
        return $this->syncByCode($request, 'e');
    }

    public function syncL1F1(Request $request)
    {
        return $this->syncByCode($request, 'f');
    }

    public function syncL1G1(Request $request)
    {
        return $this->syncByCode($request, 'g');
    }

    public function syncL1H1(Request $request)
    {
        return $this->syncByCode($request, 'h');
    }

    public function syncL1I1(Request $request)
    {
        return $this->syncByCode($request, 'i');
    }

    public function syncL1J1(Request $request)
    {
        return $this->syncByCode($request, 'j');
    }

    public function syncL1K1(Request $request)
    {
        return $this->syncByCode($request, 'k');
    }

    public function syncL1L1(Request $request)
    {
        return $this->syncByCode($request, 'l');
    }

    private function syncByCode(Request $request, string $code)
    {
        $validated = $request->validate([
            'spt_badan_id'           => ['required', 'uuid', 'exists:spt_badan,id'],
            'rows'                   => ['nullable', 'array'],
            'rows.*.id'              => ['nullable', 'uuid'],
            'rows.*.account_id'      => ['nullable', 'integer', 'exists:master_accounts,id'],
            'rows.*.account_code'    => ['nullable', 'string'],
            'rows.*.amount'          => ['nullable', 'integer'],
            'rows.*.non_taxable'     => ['nullable', 'integer', 'min:0'],
            'rows.*.subject_to_final' => ['nullable', 'integer', 'min:0'],
            'rows.*.non_final'       => ['nullable', 'integer', 'min:0'],
            'rows.*.fiscal_positive' => ['nullable', 'integer'],
            'rows.*.fiscal_negative' => ['nullable', 'integer', 'min:0'],
            'rows.*.fiscal_code'     => ['nullable', 'string'],
            'rows.*.fiscal_amount'   => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];
        $rows       = $validated['rows'] ?? [];

        SptBadanL1A::where('spt_badan_id', $sptBadanId)
            ->where('code', $code)
            ->delete();

        foreach ($rows as $row) {
            $accountId = $row['account_id'] ?? null;
            if (!$accountId && !empty($row['account_code'])) {
                $accountId = MasterAccount::query()
                    ->where('code', (string) $row['account_code'])
                    ->value('id');
            }

            if (!$accountId) {
                continue;
            }

            SptBadanL1A::create([
                'id'              => $row['id'] ?? null,
                'spt_badan_id'    => $sptBadanId,
                'account_id'      => $accountId,
                'code'            => $code,
                'amount'          => (int) ($row['amount'] ?? 0),
                'non_taxable'     => (int) ($row['non_taxable'] ?? 0),
                'subject_to_final' => (int) ($row['subject_to_final'] ?? 0),
                'non_final'       => (int) ($row['non_final'] ?? 0),
                'fiscal_positive' => (int) ($row['fiscal_positive'] ?? 0),
                'fiscal_negative' => (int) ($row['fiscal_negative'] ?? 0),
                'fiscal_code'     => $row['fiscal_code'] ?? '',
                'fiscal_amount'   => (int) ($row['fiscal_amount'] ?? 0),
            ]);
        }

        $d4Value = 0;
        $labaRugiAccountId = MasterAccount::query()
            ->whereRaw('LOWER(name) LIKE ?', ['%laba%'])
            ->whereRaw('LOWER(name) LIKE ?', ['%sebelum pajak%'])
            ->value('id');

        if ($labaRugiAccountId) {
            foreach ($rows as $row) {
                if ((int) ($row['account_id'] ?? 0) === (int) $labaRugiAccountId) {
                    $d4Value = (int) ($row['fiscal_amount'] ?? 0);
                    break;
                }
            }
        }

        SptBadan::where('id', $sptBadanId)->update([
            'd_4' => $d4Value,
        ]);

        return back(303);
    }
}
