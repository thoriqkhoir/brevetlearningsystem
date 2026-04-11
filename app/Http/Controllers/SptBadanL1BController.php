<?php

namespace App\Http\Controllers;

use App\Models\MasterAccount;
use App\Models\SptBadanL1B;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptBadanL1BController extends Controller
{
    public function sync(Request $request)
    {
        return $this->syncByCode($request, 'a');
    }

    public function syncL1B2(Request $request)
    {
        return $this->syncByCode($request, 'b');
    }

    public function syncL1C2(Request $request)
    {
        return $this->syncByCode($request, 'c');
    }

    public function syncL1D2(Request $request)
    {
        return $this->syncByCode($request, 'd');
    }

    public function syncL1E2(Request $request)
    {
        return $this->syncByCode($request, 'e');
    }

    public function syncL1F2(Request $request)
    {
        return $this->syncByCode($request, 'f');
    }

    public function syncL1G2(Request $request)
    {
        return $this->syncByCode($request, 'g');
    }

    public function syncL1H2(Request $request)
    {
        return $this->syncByCode($request, 'h');
    }

    public function syncL1I2(Request $request)
    {
        return $this->syncByCode($request, 'i');
    }

    public function syncL1J2(Request $request)
    {
        return $this->syncByCode($request, 'j');
    }

    public function syncL1K2(Request $request)
    {
        return $this->syncByCode($request, 'k');
    }

    public function syncL1L2(Request $request)
    {
        return $this->syncByCode($request, 'l');
    }

    private function syncByCode(Request $request, string $code)
    {
        $validated = $request->validate([
            'spt_badan_id'      => ['required', 'uuid', 'exists:spt_badan,id'],
            'rows'              => ['nullable', 'array'],
            'rows.*.id'         => ['nullable', 'uuid'],
            'rows.*.account_id' => ['nullable', 'integer', 'exists:master_accounts,id'],
            'rows.*.account_code' => ['nullable', 'string'],
            'rows.*.code'       => ['nullable', 'string'],
            'rows.*.amount'     => ['nullable', 'integer'],
        ]);

        $sptBadanId = $validated['spt_badan_id'];
        $rows = $validated['rows'] ?? [];

        SptBadanL1B::where('spt_badan_id', $sptBadanId)
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

            SptBadanL1B::create([
                'id'           => $row['id'] ?? Str::uuid()->toString(),
                'spt_badan_id' => $sptBadanId,
                'account_id'   => $accountId,
                'code'         => $code,
                'amount'       => (int) ($row['amount'] ?? 0),
            ]);
        }

        return back(303);
    }
}
