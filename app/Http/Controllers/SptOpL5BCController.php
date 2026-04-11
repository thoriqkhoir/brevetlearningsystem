<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\SptOpL5BC;
use App\Models\SptOp;

class SptOpL5BCController extends Controller
{
    private const NETO_OPTIONS = [
        'Zakat (Sesuai PP Nomor 60 Tahun 2010)',
        'Sumbangan keagamaan (Sesuai PP Nomor 60 Tahun 2010)',
        'Fasilitas pengurang penghasilan Neto (Tax allowance)',
        'Fasilitas keringanan pajak lainnya (Tax reliefs)',
        'Pengurang penghasilan neto lainnya',
    ];

    private const PPH_OPTIONS = [
        'Fasilitas pembebasan atau pengurangan PPh (Tax holiday)',
        'Pengurang PPh Lainnya',
    ];

    private function allowedIncomeOptions(?string $typeOfReducer): array
    {
        if ($typeOfReducer === 'neto') {
            return self::NETO_OPTIONS;
        }
        if ($typeOfReducer === 'pph') {
            return self::PPH_OPTIONS;
        }
        return array_values(array_unique(array_merge(self::NETO_OPTIONS, self::PPH_OPTIONS)));
    }

    public function store(Request $request)
    {
        $typeOfReducer = $request->input('type_of_reducer');
        $request->validate([
            'spt_op_id' => ['required', 'uuid'],
            'type_of_reducer' => ['required', Rule::in(['neto', 'pph'])],
            'code' => ['required', 'string'],
            'type_of_income' => ['required', 'string', Rule::in($this->allowedIncomeOptions($typeOfReducer))],
            'amount_of_reducer' => ['nullable', 'integer'],
        ]);

        SptOpL5BC::create([
            'spt_op_id' => $request->input('spt_op_id'),
            'type_of_reducer' => $typeOfReducer,
            'code' => $request->input('code'),
            'type_of_income' => $request->input('type_of_income'),
            'amount_of_reducer' => (int)($request->input('amount_of_reducer') ?? 0),
        ]);

        $this->recalculateSptOpReducer($request->input('spt_op_id'));

        return back();
    }

    public function update(Request $request, string $id)
    {
        $typeOfReducer = $request->input('type_of_reducer');
        $request->validate([
            'type_of_reducer' => ['required', Rule::in(['neto', 'pph'])],
            'code' => ['required', 'string'],
            'type_of_income' => ['required', 'string', Rule::in($this->allowedIncomeOptions($typeOfReducer))],
            'amount_of_reducer' => ['nullable', 'integer'],
        ]);

        $item = SptOpL5BC::findOrFail($id);
        $item->update([
            'type_of_reducer' => $typeOfReducer,
            'code' => $request->input('code'),
            'type_of_income' => $request->input('type_of_income'),
            'amount_of_reducer' => (int)($request->input('amount_of_reducer') ?? 0),
        ]);

        $this->recalculateSptOpReducer($item->spt_op_id);

        return back();
    }

    public function destroy(string $id)
    {
        $item = SptOpL5BC::findOrFail($id);
        $sptOpId = $item->spt_op_id;

        $item->delete();

        $this->recalculateSptOpReducer($sptOpId);

        return back();
    }

    /**
     * Recalculate SPT OP values from all Lampiran 5B/5C reducers.
     * - type_of_reducer "neto" (5B): sum to c_3_value
     * - type_of_reducer "pph" (5C): sum to c_8_value
     */
    private function recalculateSptOpReducer(string $sptOpId): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Sum all "neto" (5B) reducers
        $totalNeto = (int) SptOpL5BC::where('spt_op_id', $sptOpId)
            ->where('type_of_reducer', 'neto')
            ->sum('amount_of_reducer');

        // Sum all "pph" (5C) reducers
        $totalPph = (int) SptOpL5BC::where('spt_op_id', $sptOpId)
            ->where('type_of_reducer', 'pph')
            ->sum('amount_of_reducer');

        $shouldKeepC3 = $totalNeto > 0 ? true : (bool) $sptOp->c_3;
        $shouldKeepC8 = $totalPph > 0 ? true : (bool) $sptOp->c_8;

        $sptOp->update([
            'c_3' => $shouldKeepC3,
            'c_3_value' => $totalNeto,
            'c_8' => $shouldKeepC8,
            'c_8_value' => $totalPph,
        ]);
    }
}
