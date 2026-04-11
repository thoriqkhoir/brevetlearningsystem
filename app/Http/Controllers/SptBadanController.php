<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Billing;
use App\Models\BusinessEntity;
use App\Models\CourseResult;
use App\Models\CourseUser;
use App\Models\Ledger;
use App\Models\MasterAccount;
use App\Models\Spt;
use App\Models\SptBadan;
use App\Models\SptBadanL1A;
use App\Models\SptBadanL1B;
use App\Models\SptBadanL2A;
use App\Models\SptBadanL2B;
use App\Models\SptBadanL3A;
use App\Models\SptBadanL3B;
use App\Models\SptBadanL4A;
use App\Models\SptBadanL4B;
use App\Models\SptBadanL5A;
use App\Models\SptBadanL5B;
use App\Models\SptBadanL6;
use App\Models\SptBadanL7;
use App\Models\SptBadanL8;
use App\Models\SptBadanL9;
use App\Models\SptBadanL10A;
use App\Models\SptBadanL10B;
use App\Models\SptBadanL10C;
use App\Models\SptBadanL10D;
use App\Models\SptBadanL11A1;
use App\Models\SptBadanL11A2;
use App\Models\SptBadanL11A3;
use App\Models\SptBadanL11A4A;
use App\Models\SptBadanL11A5;
use App\Models\SptBadanL11A4B;
use App\Models\SptBadanL11B1;
use App\Models\SptBadanL11B2A;
use App\Models\SptBadanL11B2B;
use App\Models\SptBadanL11B3;
use App\Models\SptBadanL11C;
use App\Models\SptBadanL12A;
use App\Models\SptBadanL12B12;
use App\Models\SptBadanL12B3;
use App\Models\SptBadanL12B4;
use App\Models\SptBadanL12B5;
use App\Models\SptBadanL12B6;
use App\Models\SptBadanL12B7;
use App\Models\SptBadanL12B8;
use App\Models\SptBadanL13A;
use App\Models\SptBadanL13BA;
use App\Models\SptBadanL13BB;
use App\Models\SptBadanL13BC;
use App\Models\SptBadanL13BD;
use App\Models\SptBadanL13C;
use App\Models\SptBadanL14;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SptBadanController extends Controller
{
    /**
     * Show the detail page for SPT Badan
     */
    public function show($id)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        $activeBusinessEntityId = session('active_business_entity_id');
        if (!$activeBusinessEntityId) {
            return redirect()->route('spt.konsep')->with('error', 'Badan usaha aktif belum dipilih.');
        }

        $user = Auth::user();
        $activeBusinessEntity = BusinessEntity::query()
            ->where('id', $activeBusinessEntityId)
            ->where('user_id', $user->id)
            ->first();

        if (!$activeBusinessEntity) {
            session()->forget('active_business_entity_id');
            return redirect()->route('spt.konsep')->with('error', 'Badan usaha aktif tidak ditemukan.');
        }

        $spt = Spt::with(['form', 'user'])
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHBADAN');
            })
            ->findOrFail($id);

        $existingSptBadan = SptBadan::where('spt_id', $spt->id)->first();
        if ($existingSptBadan && $existingSptBadan->business_entity_id !== $activeBusinessEntity->id) {
            return redirect()->route('spt.konsep')->with('error', 'Anda tidak memiliki akses ke SPT Badan ini.');
        }

        // Get or create SptBadan record
        $sptBadan = SptBadan::firstOrCreate(
            [
                'spt_id' => $spt->id,
                'business_entity_id' => $activeBusinessEntity->id,
            ],
            [
                'type_of_bookkeeping' => 'pencatatan',
            ]
        );

        // Get ledger data for saldo calculation
        $ledgers = Ledger::where('user_id', $user->id)
            ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })->get();

        $totalCredit = $ledgers->sum('credit_amount');
        $totalDebit = $ledgers->sum('debit_amount');
        $totalDebitUnpaid = $ledgers->sum('debit_unpaid');
        $totalCreditLeft = $totalDebit + $totalCredit;
        $saldo = $totalCreditLeft - $totalDebitUnpaid;

        // Transaction number generation
        $kap = "411126"; // KAP for PPh Badan
        $kjs = "200";
        $lastLedger = Ledger::where('kap', $kap)
            ->where('kjs', $kjs)
            ->orderBy('transaction_number', 'desc')
            ->first();
        if ($lastLedger && preg_match('/(\d{3})$/', $lastLedger->transaction_number, $matches)) {
            $lastSequence = (int)$matches[1];
            $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $sequence = '001';
        }
        $currentDate = now()->format('dmY');
        $transactionNumber = $kap . $kjs . $currentDate . $sequence;

        // Get user's banks
        $banks = Bank::where('user_id', $user->id)
            ->orderBy('is_primary', 'desc')
            ->orderBy('bank_name')
            ->get();

        // Get master accounts for L1A tab
        $masterAccounts = MasterAccount::orderBy('code')->get();

        // Get L1A data for this sptBadan
        $l1a1 = SptBadanL1A::where('spt_badan_id', $sptBadan->id)->get();
        $l1a2 = SptBadanL1B::where('spt_badan_id', $sptBadan->id)->get();
        $l2a  = SptBadanL2A::where('spt_badan_id', $sptBadan->id)->get();
        $l2b  = SptBadanL2B::where('spt_badan_id', $sptBadan->id)->get();
        $l3a  = SptBadanL3A::where('spt_badan_id', $sptBadan->id)->get();
        $l3b  = SptBadanL3B::where('spt_badan_id', $sptBadan->id)->get();
        $l4a  = SptBadanL4A::where('spt_badan_id', $sptBadan->id)->get();
        $l4b  = SptBadanL4B::where('spt_badan_id', $sptBadan->id)->get();
        $l5a  = SptBadanL5A::where('spt_badan_id', $sptBadan->id)->get();
        $l5b  = SptBadanL5B::where('spt_badan_id', $sptBadan->id)->get();
        $l6   = SptBadanL6::where('spt_badan_id', $sptBadan->id)->first();
        $l7   = SptBadanL7::where('spt_badan_id', $sptBadan->id)->get();
        $l8   = SptBadanL8::where('spt_badan_id', $sptBadan->id)->first();
        $l9   = SptBadanL9::where('spt_badan_id', $sptBadan->id)->get();
        $l10a = SptBadanL10A::where('spt_badan_id', $sptBadan->id)->get();
        $l10b = SptBadanL10B::where('spt_badan_id', $sptBadan->id)->first();
        $l10c = SptBadanL10C::where('spt_badan_id', $sptBadan->id)->get();
        $l10d  = SptBadanL10D::where('spt_badan_id', $sptBadan->id)->first();
        $l11a1 = SptBadanL11A1::where('spt_badan_id', $sptBadan->id)->get();
        $l11a2 = SptBadanL11A2::where('spt_badan_id', $sptBadan->id)->get();
        $l11a3 = SptBadanL11A3::where('spt_badan_id', $sptBadan->id)->get();
        $l11a4a = SptBadanL11A4A::where('spt_badan_id', $sptBadan->id)->get();
        $l11a5 = SptBadanL11A5::where('spt_badan_id', $sptBadan->id)->get();
        $l11a4b = SptBadanL11A4B::where('spt_badan_id', $sptBadan->id)->first();
        $l11b1  = SptBadanL11B1::where('spt_badan_id', $sptBadan->id)->first();
        $l11b2a = SptBadanL11B2A::where('spt_badan_id', $sptBadan->id)->get();
        $l11b2b = SptBadanL11B2B::where('spt_badan_id', $sptBadan->id)->get();
        $l11b3  = SptBadanL11B3::where('spt_badan_id', $sptBadan->id)->get();
        $l11c   = SptBadanL11C::where('spt_badan_id', $sptBadan->id)->get();
        $l12a   = SptBadanL12A::where('spt_badan_id', $sptBadan->id)->first();
        $l12b12 = SptBadanL12B12::where('spt_badan_id', $sptBadan->id)->get();
        $l12b3  = SptBadanL12B3::where('spt_badan_id', $sptBadan->id)->get();
        $l12b4  = SptBadanL12B4::with('items')->where('spt_badan_id', $sptBadan->id)->get();
        $l12b5  = SptBadanL12B5::where('spt_badan_id', $sptBadan->id)->get();
        $l12b6  = SptBadanL12B6::where('spt_badan_id', $sptBadan->id)->get();
        $l12b7  = SptBadanL12B7::where('spt_badan_id', $sptBadan->id)->get();
        $l12b8  = SptBadanL12B8::where('spt_badan_id', $sptBadan->id)->get();
        $l13a   = SptBadanL13A::where('spt_badan_id', $sptBadan->id)->get();
        $l13ba  = SptBadanL13BA::where('spt_badan_id', $sptBadan->id)->get();
        $l13bb  = SptBadanL13BB::where('spt_badan_id', $sptBadan->id)->first();
        $l13bc  = SptBadanL13BC::where('spt_badan_id', $sptBadan->id)->get();
        $l13bd  = SptBadanL13BD::where('spt_badan_id', $sptBadan->id)->first();
        $l13c   = SptBadanL13C::where('spt_badan_id', $sptBadan->id)->get();
        $l14    = SptBadanL14::where('spt_badan_id', $sptBadan->id)->get();

        return Inertia::render('SPT/DetailSPTBadan', [
            'spt'               => $spt,
            'sptBadan'          => $sptBadan,
            'activeBusinessEntity' => [
                'id' => $activeBusinessEntity->id,
                'name' => $activeBusinessEntity->name,
                'npwp' => $activeBusinessEntity->npwp,
                'address' => $activeBusinessEntity->address,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
            ],
            'saldo'             => $saldo,
            'transactionNumber' => $transactionNumber,
            'banks'             => $banks,
            'masterAccounts'    => $masterAccounts,
            'l1aLayout'         => $this->buildL1ALayout(),
            'l1bLayout'         => $this->buildL1BLayout(),
            'l1cLayout'         => $this->buildL1CLayout(),
            'l1dLayout'         => $this->buildL1DLayout(),
            'l1eLayout'         => $this->buildL1ELayout(),
            'l1fLayout'         => $this->buildL1FLayout(),
            'l1gLayout'         => $this->buildL1GLayout(),
            'l1hLayout'         => $this->buildL1HLayout(),
            'l1iLayout'         => $this->buildL1ILayout(),
            'l1jLayout'         => $this->buildL1JLayout(),
            'l1kLayout'         => $this->buildL1KLayout(),
            'l1lLayout'         => $this->buildL1LLayout(),
            'l1a1'              => $l1a1,
            'l1a2'              => $l1a2,
            'l2a'               => $l2a,
            'l2b'               => $l2b,
            'l3a'               => $l3a,
            'l3b'               => $l3b,
            'l4a'               => $l4a,
            'l4b'               => $l4b,
            'l5a'               => $l5a,
            'l5b'               => $l5b,
            'l6'                => $l6,
            'l7'                => $l7,
            'l8'                => $l8,
            'l9'                => $l9,
            'l10a'              => $l10a,
            'l10b'              => $l10b,
            'l10c'              => $l10c,
            'l10d'              => $l10d,
            'l11a1'             => $l11a1,
            'l11a2'             => $l11a2,
            'l11a3'             => $l11a3,
            'l11a4a'            => $l11a4a,
            'l11a5'             => $l11a5,
            'l11a4b'            => $l11a4b,
            'l11b1'             => $l11b1,
            'l11b2a'            => $l11b2a,
            'l11b2b'            => $l11b2b,
            'l11b3'             => $l11b3,
            'l11c'              => $l11c,
            'l12a'              => $l12a,
            'l12b12'            => $l12b12,
            'l12b3'             => $l12b3,
            'l12b4'             => $l12b4,
            'l12b5'             => $l12b5,
            'l12b6'             => $l12b6,
            'l12b7'             => $l12b7,
            'l12b8'             => $l12b8,
            'l13a'              => $l13a,
            'l13ba'             => $l13ba,
            'l13bb'             => $l13bb,
            'l13bc'             => $l13bc,
            'l13bd'             => $l13bd,
            'l13c'              => $l13c,
            'l14'               => $l14,
        ]);
    }

    private function buildL1ALayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Penjualan' => [
                    '4002',
                    '4003',
                    '4004',
                ],
                'Dikurangi :' => [
                    '4011',
                    '4012',
                    '4013',
                    '4020',
                ],
                'Harga Pokok Penjualan (HPP)' => [
                    '5001',
                    '5003',
                    '5007',
                    '5008',
                    '5009',
                    '5020',
                    '4300',
                    '4199'
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5399',
                    '5400',
                    '4500'
                ],
                'Pendapatan Non Usaha' => [
                    '4501',
                    '4503',
                    '4511',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409',
                    '5421',
                    '5499',
                    '5500',
                    '4700',
                    '4800'
                ],
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1122',
                    '1123',
                    '1124',
                    '1125',
                    '1131',
                    '1181',
                    '1200',
                    '1401',
                    '1421',
                    '1423',
                    '1405',
                    '1422',
                    '1499',
                    '1501',
                    '1520',
                    '1523',
                    '1524',
                    '1529',
                    '1530',
                    '1531',
                    '1533',
                    '1534',
                    '1551',
                    '1599',
                    '1600',
                    '1601',
                    '1611',
                    '1651',
                    '1658',
                    '1698',
                    '1700',
                ],
                'right' => [
                    '2102',
                    '2103',
                    '2111',
                    '2186',
                    '2187',
                    '2191',
                    '2192',
                    '2195',
                    '2201',
                    '2202',
                    '2203',
                    '2228',
                    '2301',
                    '2303',
                    '2304',
                    '2312',
                    '2322',
                    '2321',
                    '2998',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1BLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Penjualan' => [
                    '4002',
                    '4003',
                    '4004',
                ],
                'Dikurangi :' => [
                    '4011',
                    '4012',
                    '4013',
                    '4020'
                ],
                'Harga Pokok Produksi' => [
                    
                ],
                'Biaya Bahan Baku' => [
                    '5021',
                    '5022',
                    '5029',
                    '5030',
                    '5031',
                    '5032',
                    '5040',
                    '5050',
                ],
                'Biaya Pabrikasi' => [
                    '5051',
                    '5052',
                    '5058',
                    '5059',
                    '5069',
                    '5070',
                    '5080',
                    '5090',
                    '5099',
                    '5100',
                    '5008',
                    '5009',
                    '5020',
                    '4300',
                    '4199',
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5399',
                    '5400',
                    '4500',
                ],
                'Pendapatan Non Usaha' => [
                    '4501',
                    '4503',
                    '4511',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409',
                    '5421',
                    '5499',
                    '5500',
                    '4700',
                    '4800',
                ],
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1122',
                    '1123',
                    '1124',
                    '1125',
                    '1131',
                    '1181',
                    '1200',
                    '1402',
                    '1403',
                    '1404',
                    '1405',
                    '1421',
                    '1422',
                    '1423',
                    '1499',
                    '1501',
                    '1520',
                    '1523',
                    '1524',
                    '1525',
                    '1526',
                    '1527',
                    '1528',
                    '1529',
                    '1530',
                    '1533',
                    '1534',
                    '1551',
                    '1599',
                    '1600',
                    '1601',
                    '1611',
                    '1651',
                    '1658',
                    '1698',
                    '1700',
                ],
                'right' => [
                    '2102',
                    '2103',
                    '2111',
                    '2186',
                    '2187',
                    '2191',
                    '2192',
                    '2195',
                    '2201',
                    '2202',
                    '2203',
                    '2228',
                    '2301',
                    '2303',
                    '2304',
                    '2312',
                    '2321',
                    '2322',
                    '2998',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1CLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Penjualan' => [
                    '4002',
                    '4003',
                    '4004',
                ],
                'Dikurangi :' => [
                    '4011',
                    '4012',
                    '4013',
                    '4020'
                ],
                'Harga Pokok Penjualan (HPP)' => [
                    '5001',
                    '5003',
                    '5007',
                    '5008',
                    '5009',
                    '5020',
                    '4300',
                    '4199'
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5399',
                    '5400',
                    '4500',
                    '5399',
                    '5400',
                    '4500',
                ],
                'Pendapatan Non Usaha' => [
                    '4501',
                    '4503',
                    '4511',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409',
                    '5421',
                    '5499',
                    '5500',
                    '4700',
                    '4800',
                ]   
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1200',
                    '1122',
                    '1123',
                    '1124',
                    '1125',
                    '1181',
                    '1131',
                    '1401',
                    '1423',
                    '1421',
                    '1422',
                    '1499',
                    '1500',
                    '1501',
                    '1520',
                    '1523',
                    '1524',
                    '1529',
                    '1530',
                    '1533',
                    '1534',
                    '1551',
                    '1599',
                    '1600',
                    '1601',
                    '1611',
                    '1651',
                    '1658',
                    '1698',
                    '1699',
                    '1700',
                ],
                'right' => [
                    '2102',
                    '2103',
                    '2104',
                    '2105',
                    '2106',
                    '2107',
                    '2108',
                    '2109',
                    '2110',
                    '2111',
                    '2112',
                    '2113',
                    '2114',
                    '2301',
                    '2303',
                    '2304',
                    '2312',
                    '2322',
                    '2321',
                    '2998',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1DLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan :' => [
                    '4021',
                    '4013',
                    '5020',
                    '4300',
                    '4199',
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5323',
                    '5324',
                ],
                'Pendapatan Non Usaha' => [
                    '4501',
                    '4503',
                    '4511',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409', 
                    '5421',
                    '5499',
                    '5500',
                    '4700',
                    '4800',
                ],
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1122',
                    '1123',
                    '1124',
                    '1125',
                    '1131',
                    '1181',
                    '1200',
                    '1401',
                    '1421',
                    '1422',
                    '1423',
                    '1499',
                    '1501',
                    '1521',
                    '1522',
                    '1551',
                    '1599',
                    '1600',
                    '1601',
                    '1611',
                    '1651',
                    '1658',
                    '1698',
                    '1700',
                ],
                'right' => [
                    '2102',
                    '2103',
                    '2111',
                    '2186',
                    '2187',
                    '2191',
                    '2192',
                    '2195',
                    '2201',
                    '2202',
                    '2203',
                    '2228',
                    '2301',
                    '2303',
                    '2304',
                    '2312',
                    '2321',
                    '2322',
                    '2998',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1ELayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan Bunga' => [
                    '4027',
                    '4028',
                ],
                'Beban Bunga :' => [
                    '4031',
                    '4033',
                    '4040',
                ],
                'Pendapatan Operasional Lain' => [
                    '4071',
                    '4072',
                    '4073',
                    '4074',
                    '4091',
                    '4092',
                    '4093',
                    '4094',
                    '4199',
                    '4210',
                ],
                'Beban Operasional Lain' => [
                    '5350',
                    '5351',
                    '5352',
                    '5353',
                    '5354',
                    '5346',
                    '5356',
                    '5348',
                    '5358',
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5320',
                    '5321',
                    '5322',
                    '5399',
                    '5401',
                    '4400',
                    '4600',
                    '5500',
                    '4700',
                    '4800',
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1105',
                    '1106',
                    '1155',
                    '1152',
                    '1153',
                    '1154',
                    '1157',
                    '1156',
                    '1141',
                    '1271',
                    '1131',
                    '1600',
                    '1601',
                    '1521',
                    '1522',
                    '1535',
                    '1658',
                    '1561',
                    '1611',
                    '1421',
                    '1698',
                    '1700',
                ],
                'right' => [
                    '2140',
                    '2141',
                    '2152',
                    '2160',
                    '2162',
                    '2163',
                    '2156',
                    '2155',
                    '2157',
                    '2191',
                    '2204',
                    '2211',
                    '2214',
                    '2321',
                    '2998',
                    '2221',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1FLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan Investasi' => [
                    '4026',
                    '4091',
                    '4101',
                    '4106',
                    '4118',
                    '4120',
                ],
                'Beban Investasi' => [
                    '5201',
                    '5202',
                    '5203',
                    '5204',
                    '5205',
                    '5299',
                    '5300',
                    '4300',
                ],
                'Beban Operasional' => [
                    '5311',
                    '5312',
                    '5323',
                    '5326',
                    '5314',
                    '5316',
                    '5317',
                    '5318',
                    '5320',
                    '5399',
                    '5400',
                ],
                'Laba (Rugi) Non Operasional' => [
                    '4512',
                    '4513',
                    '4514',
                    '4599',
                    '5499',
                    '4700',
                    '4800',
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1201',	
                    '1202',	
                    '1203',	
                    '1204',	
                    '1223',	
                    '1225',	
                    '1241', 	
                    '1242',	
                    '1243',	
                    '1244',	
                    '1251',	
                    '1252',	
                    '1253',	
                    '1254',	
                    '1255',	
                    '1256',	
                    '1260',	
                    '1272',	
                    '1281',	
                    '1282',	
                    '1283',	
                    '1290',	
                    '1300',	
                    '1301',
                    '1101',	
                    '1193',	
                    '1194',	
                    '1195',	
                    '1111',	
                    '1423',	
                    '1421',	
                    '1121',	
                    '1122',	
                    '1180',	
                    '1500',	
                    '1521',	
                    '1522',	
                    '1679',	
                    '1698',	
                    '1700'		
                ],
                'right' => [
                    '2181',	
                    '2183',	
                    '2184',	
                    '2185',	
                    '2203',	
                    '2195',	
                    '2322',	
                    '2998',	
                    '2900',	
                    '2999',	
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1GLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan' => [
                    '4041',	
                    '4045',	
                    '4047',	
                    '4051',	
                    '4060',	
                    '4171',	
                    '4200'
                ],
                'Beban Underwriting' => [
                    '5101',	
                    '5102',	
                    '5103',	
                    '5109',	
                    '5200',	
                    '4300',	
                    '4120',	
                    '4199'	
                ],
                'Beban Operasional' => [
                    '5311',	
                    '5312',	
                    '5313',	
                    '5314',	
                    '5315',	
                    '5316',	
                    '5317',	
                    '5318',	
                    '5319',	
                    '5320',	
                    '5321',	
                    '5399',	
                    '5400',	
                    '4600',	
                    '5500',	
                    '4700',	
                    '4800'	
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1203',	
                    '1204',	
                    '1232',	
                    '1244',	
                    '1181',	
                    '1131',	
                    '1252',	
                    '1226',	
                    '1227',	
                    '1222',	
                    '1224',	
                    '1251',	
                    '1253',	
                    '1254',	
                    '1260',	
                    '1272',	
                    '1282',	
                    '1291',	
                    '1292',	
                    '1293',	
                    '1294',	
                    '1299',	
                    '1300',
                    '1101',
                    '1130',
                    '1132',
                    '1191',
                    '1133',
                    '1134',
                    '1121',
                    '1122',
                    '1521',
                    '1522',
                    '1613',
                    '1698',
                    '1700'
                ],
                'right' => [
                    '2167',
                    '2168',
                    '2165',
                    '2166',
                    '2186',
                    '2191',
                    '2195',
                    '2322',
                    '2194',
                    '2171',
                    '2172',
                    '2173',
                    '2174',
                    '2361',
                    '2998',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300'

                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1HLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Penjualan' => [
                    '4001',
                    '4013',
                    '4026',
                    '4101',
                    '4071',
                    '5020',
                    '4300',
                    '4153',
                    '4199',
                    '5324',
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5003',
                    '5314',
                    '5315',
                    '4031',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5399',
                    '5400',
                    '4500',
                ],
                'Pendapatan Non Usaha' => [
                    '4511',
                    '4501',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409',
                    '5421',
                    '5499',
                    '5500',
                    '4700',
                    '4800',
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1211',
                    '1212',
                    '1213',
                    '1181',
                    '1131',
                    '1214',
                    '1180',
                    '1401',
                    '1421',
                    '1422',
                    '1423',
                    '1499',
                    '1500',
                    '1519',
                    '1542',
                    '1551',
                    '1573',
                    '1574',
                    '1611',
                    '1583',
                    '1621',
                    '1521',
                    '1522',
                    '1533',
                    '1534',
                    '1612',
                    '1658',
                    '1699',
                    '1700',
                ],
                'right' => [
                    '2201',
                    '2121',
                    '2194',
                    '2203',
                    '2192',
                    '2195',
                    '2191',
                    '2186',
                    '2187',
                    '2151',
                    '2228',
                    '2229',
                    '2321',
                    '2312',
                    '2322',
                    '2301',
                    '2302',
                    '2306',
                    '2341',
                    '2342',
                    '2998',
                    '2900',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300',
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1ILayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan dan Beban Operasional' => [
                    
                ],
                'Pendapatan dari Penyaluran Dana' => [
                    
                ],
                'Pendapatan dari Piutang' => [
                    '4121',	
                    '4122',
                    '4123',
                    '4130',
                ],
                'Pendapatan Bagi Hasil' => [
                    '4131',	
                    '4132',	
                    '4140',	
                    '4149',	
                    '4150',	
                ],
                'Bagi Hasil untuk Pemilik Dana Investasi' => [
                    '5301',	
                    '5302',	
                    '5310',	
                    '4300',	
                ],
                'Pendapatan dan Beban Operasional selain dari Penyaluran Dana' => [
                    
                ],
                'Pendapatan Operasional Lain' => [
                    '4071',                   	
                    '4073',
                    '4074',
                    '4084',
                    '4092',
                    '4091',
                    '4093',
                    '4094',
                    '4199',
                    '4210', 
                ],
                'Beban Operasional Lainnya' => [
                    '5341',
                    '5342',
                    '5343',
                    '5344',
                    '5345',
                    '5346', 
                    '5347',
                    '5348',
                    '5349',
                    '5311',
                    '5313',
                    '5315',
                    '5320',
                    '5321',
                    '5314',
                    '5399',
                    '5401',
                    '4220',
                    '4500'
                ],

                'PENDAPATAN NON-OPERASIONAL' => [
                    '4502',    
                    '4503',	
                    '4501',	
                    '4599'	
                ],

                'BEBAN NON-OPERASIONAL' => [
                    '5422',	
                    '5421',	
                    '5499',	
                    '4700',	
                    '4800'	
                ],
            ],
            'a2' => [
                'left' => [
                    '1101',    
                    '1102',	
                    '1105',
                    '1106',
                    '1155',
                    '1152',
                    '1160',
                    '1142',
                    '1143',
                    '1149',
                    '1561',
                    '1271',
                    '1131',
                    '1600',
                    '1601',
                    '1631',
                    '1633',
                    '1634',
                    '1521',
                    '1522',
                    '1535',
                    '1658',
                    '1401',
                    '1611',
                    '1421',
                    '1698',
                    '1700',
                ],
                'right' => [
                    '2141',	
                    '2142',	
                    '2162',	
                    '2161',	
                    '2156',	
                    '2204',	
                    '2205',	
                    '2211',	
                    '2214',	
                    '2314',	
                    '2998',	
                    '2221',	
                    '2999',
                    '3102',	
                    '3120',	
                    '3200',	
                    '3297',	
                    '3298',	
                    '3299',	
                    '3300'		
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1JLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Penjualan' => [
                    '4001',
                    '4013',
                    '4026',
                    '5020',
                    '4300',
                    '4199',
                    '5324',
                    '5325',
                ],
                'Beban Usaha' => [
                    '5311',
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',
                    '5319',
                    '5320',
                    '5321',
                    '5322',
                    '5322',	
                    '5399',	
                    '5400',	
                    '4153',	
                    '4154',	
                    '4155',	
                    '4156',	
                ],
                'Pendapatan Non Usaha' => [
                    '4501',
                    '4511',
                    '4599',
                    '4600',
                ],
                'Beban Non Usaha' => [
                    '5405',
                    '5409',
                    '5421',
                    '5499',
                    '5500',
                    '4800',
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1101',
                    '1211',
                    '1212',
                    '1213',
                    '1180',
                    '1181',
                    '1131',
                    '1401',
                    '1421',
                    '1422',
                    '1423',
                    '1499',
                    '1500',
                    '1518',
                    '1519',
                    '1551',
                    '1571',
                    '1573',
                    '1574',
                    '1611',
                    '1621',
                    '1521',
                    '1522',
                    '1655',
                    '1658',
                    '1698',
                    '1699',
                    '1700',
                ],
                'right' => [
                    '2201',	
                    '2121',	
                    '2194',	
                    '2203',	
                    '2191',	
                    '2186',	
                    '2187',	
                    '2193',	
                    '2202',	
                    '2228',	
                    '2229',
                    '2321',
                    '2344',
                    '2345',
                    '2312',
                    '2322',
                    '2301',
                    '2302',
                    '2306',
                    '2311',
                    '2313',
                    '2998',
                    '2900',
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300'
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1KLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan Usaha' => [
                    '4081',
                    '4082',
                    '4083',
                    '4026',
                    '4091',
                    '4199',
                    '4201'
                ],
                'Beban Usaha ' => [
                    '5311',	
                    '5312',
                    '5313',
                    '5314',
                    '5315',
                    '5316',
                    '5317',
                    '5318',	
                    '5319',	
                    '5320',	
                    '5321',	
                    '5322',	
                    '5205',	
                    '5399',	
                    '5400'
                ],
                'Pendapatan di luar usaha' => [
                    '4511',	
                    '4503',	
                    '4501',	
                    '4599',	
                    '4600'	
                ],
                'Beban di luar usaha' => [
                    '5405',	
                    '5421',	
                    '5409',	
                    '5499',	
                    '5500',	
                    '4800'	
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1101',	
                    '1159',
                    '1261',
                    '1161',
                    '1171',
                    '1172',
                    '1173',
                    '1176',
                    '1175',
                    '1180',
                    '1158',
                    '1154',
                    '1421',
                    '1423',
                    '1241',
                    '1181',
                    '1131',
                    '1521',
                    '1522',
                    '1551',
                    '1621',
                    '1611',
                    '1651',
                    '1698',
                    '1700'
                ],
                'right' => [
                    '2122',	
                    '2123',	
                    '2126',	
                    '2131',	
                    '2132',	
                    '2133',	
                    '2135',	
                    '2134',	
                    '2191',	
                    '2186',	
                    '2195',	
                    '2202',	
                    '2124',	
                    '2322',	
                    '2323',	
                    '2361',	
                    '2321',	
                    '2998',	
                    '2999',
                    '3102',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300'
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function buildL1LLayout(): array
    {
        $layoutByCode = [
            'a1' => [
                'Pendapatan Usaha' => [
                    '4061',	
                    '4062',	
                    '4063',	
                    '4064',	
                    '4065',	
                    '4066',	
                    '4119',	
                    '4201'	
                ],
                'Beban Usaha' => [
                    '5311',	
                    '5312',	
                    '5313',	
                    '5314',	
                    '5315',	
                    '5316',	
                    '5317',	
                    '5318',	
                    '5319',	
                    '5320',	
                    '5321',	
                    '5322',	
                    '5322',	
                    '5326',	
                    '5327',	
                    '5328',	
                    '5399',	
                    '5400',	
                ],
                'Pendapatan di Luar Usaha' => [
                    '4026',                    	
                    '4161',
                    '4501',
                    '4599',
                    '4600'
                ],
                'Beban  di Luar Usaha' => [
                    '5405',	
                    '5409',	
                    '5412',	
                    '5499',	
                    '5500',	
                    '4800'	
                ],
                
            ],
            'a2' => [
                'left' => [
                    '1102',
                    '1103',
                    '1104',
                    '1141',
                    '1151',
                    '1161',
                    '1162',
                    '1163',
                    '1164',
                    '1165',
                    '1166',
                    '1180',
                    '1423',
                    '1181',
                    '1658',
                    '1555',
                    '1556',
                    '1590',
                    '1533',
                    '1534',
                    '1521',
                    '1522',
                    '1511',
                    '1651',
                    '1611',
                    '1698',
                    '1700'

                ],
                'right' => [
                    '2201',
                    '2228',
                    '2164',
                    '2191',
                    '2311',
                    '2312',
                    '2212',
                    '2213',
                    '2204',
                    '2321',
                    '2362',
                    '2363',
                    '2322',
                    '2988',
                    '2999',
                    '3102',
                    '3110',
                    '3120',
                    '3200',
                    '3297',
                    '3298',
                    '3299',
                    '3300'
                ],
            ],
        ];

        $accountsByCode = $this->hardcodedMasterAccountsByCode();

        $mapCodes = function (array $codes, string $fallbackCategory = '') use ($accountsByCode): array {
            $rows = [];
            foreach ($codes as $accountCode) {
                $mapped = $accountsByCode[(string) $accountCode] ?? null;
                $rows[] = [
                    'id' => $mapped['id'] ?? (ctype_digit((string) $accountCode) ? (int) $accountCode : null),
                    'code' => (string) $accountCode,
                    'name' => $mapped['name'] ?? ('Akun ' . $accountCode),
                    'category' => $mapped['category'] ?? $fallbackCategory,
                ];
            }

            return $rows;
        };

        $a1 = [];
        foreach ($layoutByCode['a1'] as $category => $codes) {
            $a1[$category] = $mapCodes($codes, (string) $category);
        }

        return [
            'a1' => $a1,
            'a2' => [
                'left' => $mapCodes($layoutByCode['a2']['left'], 'Aset Lancar'),
                'right' => $mapCodes($layoutByCode['a2']['right'], 'Liabilitas Jangka Pendek'),
            ],
        ];
    }

    private function hardcodedMasterAccountsByCode(): array
    {
        $rows = [
            ['code' => '1101', 'category' => 'Aset Lancar', 'name' => 'Kas dan Setara Kas'],
            ['code' => '1102', 'category' => 'Aset Lancar', 'name' => 'Kas'],
            ['code' => '1103', 'category' => 'Aset Lancar', 'name' => 'Simpanan pada Bank Dalam Negeri'],
            ['code' => '1104', 'category' => 'Aset Lancar', 'name' => 'Simpanan pada Bank Luar Negeri'],
            ['code' => '1105', 'category' => 'Aset Lancar', 'name' => 'Penempatan pada Bank Indonesia'],
            ['code' => '1106', 'category' => 'Aset Lancar', 'name' => 'Penempatan pada Bank lain'],
            ['code' => '1111', 'category' => 'Aset Lancar', 'name' => 'Piutang Bunga Keterlambatan Iuran'],
            ['code' => '1121', 'category' => 'Aset Lancar', 'name' => 'Tagihan Investasi'],
            ['code' => '1122', 'category' => 'Aset Lancar', 'name' => 'Piutang Usaha - Pihak Ketiga'],
            ['code' => '1123', 'category' => 'Aset Lancar', 'name' => 'Piutang Usaha - Pihak yang Mempunyai Hubungan Istimewa'],
            ['code' => '1124', 'category' => 'Aset Lancar', 'name' => 'Piutang Lainnya - Pihak Ketiga'],
            ['code' => '1125', 'category' => 'Aset Lancar', 'name' => 'Piutang Lainnya - Pihak yang Mempunyai Hubungan Istimewa'],
            ['code' => '1130', 'category' => 'Aset Lancar', 'name' => 'Tagihan Premi'],
            ['code' => '1131', 'category' => 'Aset Lancar', 'name' => '(Dikurangi: Cadangan Piutang Tak Tertagih)'],
            ['code' => '1133', 'category' => 'Aset Lancar', 'name' => 'Tagihan Klaim Koasuransi'],
            ['code' => '1134', 'category' => 'Aset Lancar', 'name' => 'Tagihan Klaim Reasuransi'],
            ['code' => '1141', 'category' => 'Aset Lancar', 'name' => 'Pembiayaan Syariah'],
            ['code' => '1142', 'category' => 'Aset Lancar', 'name' => 'Pembiayaan bagi hasil Mudharabah'],
            ['code' => '1143', 'category' => 'Aset Lancar', 'name' => 'Pembiayaan bagi hasil Musyarokah'],
            ['code' => '1149', 'category' => 'Aset Lancar', 'name' => 'Pembiayaan bagi hasil lainnya'],
            ['code' => '1151', 'category' => 'Aset Lancar', 'name' => 'Investasi Jangka Pendek dalam Surat Berharga'],
            ['code' => '1152', 'category' => 'Aset Lancar', 'name' => 'Surat berharga'],
            ['code' => '1153', 'category' => 'Aset Lancar', 'name' => 'Surat berharga yang dijual dengan janji dibeli kembali (repo)'],
            ['code' => '1154', 'category' => 'Aset Lancar', 'name' => 'Tagihan atas surat berharga yang dibeli dengan janji dijual kembali'],
            ['code' => '1155', 'category' => 'Aset Lancar', 'name' => 'Tagihan spot dan derivatif'],
            ['code' => '1156', 'category' => 'Aset Lancar', 'name' => 'Kredit yang diberikan'],
            ['code' => '1157', 'category' => 'Aset Lancar', 'name' => 'Tagihan Akseptasi'],
            ['code' => '1158', 'category' => 'Aset Lancar', 'name' => 'Deposito pada Lembaga Kliring dan Penjaminan'],
            ['code' => '1159', 'category' => 'Aset Lancar', 'name' => 'Deposito pada Lembaga Kliring dan Penjaminan'],
            ['code' => '1160', 'category' => 'Aset Lancar', 'name' => 'Piutang (Murabahah, Istishna, Multijasa, Qardh, Piutang Sewa)'],
            ['code' => '1161', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Investasi Neto'],
            ['code' => '1162', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Modal Kerja Neto'],
            ['code' => '1163', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Multiguna Neto'],
            ['code' => '1164', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Jual Beli Berdasarkan Prinsip Syariah Neto'],
            ['code' => '1165', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Investasi Berdasarkan Prinsip Syariah Neto'],
            ['code' => '1166', 'category' => 'Aset Lancar', 'name' => 'Piutang Pembiayaan Jasa Berdasarkan Prinsip Syariah Neto'],
            ['code' => '1171', 'category' => 'Aset Lancar', 'name' => 'Piutang Nasabah - Pihak Berelasi'],
            ['code' => '1172', 'category' => 'Aset Lancar', 'name' => 'Piutang Nasabah - Pihak Ketiga'],
            ['code' => '1173', 'category' => 'Aset Lancar', 'name' => 'Piutang Perusahaan Efek lain'],
            ['code' => '1175', 'category' => 'Aset Lancar', 'name' => 'Piutang Kegiatan Manajer Investasi'],
            ['code' => '1176', 'category' => 'Aset Lancar', 'name' => 'Piutang Kegiatan Penjaminan Emisi Efek'],
            ['code' => '1180', 'category' => 'Aset Lancar', 'name' => 'Piutang Lain‐lain'],
            ['code' => '1181', 'category' => 'Aset Lancar', 'name' => 'Aset Kontrak'],
            ['code' => '1191', 'category' => 'Aset Lancar', 'name' => 'Aset Reasuransi'],
            ['code' => '1193', 'category' => 'Aset Lancar', 'name' => 'Iuran Normal Pemberi Kerja'],
            ['code' => '1194', 'category' => 'Aset Lancar', 'name' => 'Iuran Normal Peserta'],
            ['code' => '1195', 'category' => 'Aset Lancar', 'name' => 'Iuran Sukarela Peserta'],
            ['code' => '1200', 'category' => 'Aset Lancar', 'name' => 'Investasi'],
            ['code' => '1201', 'category' => 'Aset Lancar', 'name' => 'Tabungan pada Bank'],
            ['code' => '1202', 'category' => 'Aset Lancar', 'name' => 'Deposit on call pada Bank'],
            ['code' => '1203', 'category' => 'Aset Lancar', 'name' => 'Deposito Berjangka pada Bank'],
            ['code' => '1204', 'category' => 'Aset Lancar', 'name' => 'Sertifikat Deposito pada Bank'],
            ['code' => '1211', 'category' => 'Aset Lancar', 'name' => 'Investasi jangka pendek'],
            ['code' => '1212', 'category' => 'Aset Lancar', 'name' => 'Aset Keuangan Lancar'],
            ['code' => '1213', 'category' => 'Aset Lancar', 'name' => 'Piutang Usaha'],
            ['code' => '1214', 'category' => 'Aset Lancar', 'name' => 'Piutang Retensi'],
            ['code' => '1222', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga yang Diterbitkan oleh Bank Indonesia'],
            ['code' => '1223', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga yang diterbitkan oleh Bank Indonesia'],
            ['code' => '1224', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga yang Diterbitkan oleh Lembaga Multinasional'],
            ['code' => '1225', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga Negara'],
            ['code' => '1226', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga yang Diterbitkan oleh RI'],
            ['code' => '1227', 'category' => 'Aset Lancar', 'name' => 'Surat Berharga yang Diterbitkan oleh Negara Selain RI'],
            ['code' => '1232', 'category' => 'Aset Lancar', 'name' => 'Saham'],
            ['code' => '1241', 'category' => 'Aset Lancar', 'name' => 'Saham yang Tercatat di Bursa Efek di Indonesia'],
            ['code' => '1242', 'category' => 'Aset Lancar', 'name' => 'Obligasi Korporasi yang Tercatat di Bursa Efek di Indonesia'],
            ['code' => '1243', 'category' => 'Aset Lancar', 'name' => 'Sukuk Korporasi yang Tercatat di Bursa Efek di Indonesia'],
            ['code' => '1244', 'category' => 'Aset Lancar', 'name' => 'Obligasi/Sukuk Daerah'],
            ['code' => '1251', 'category' => 'Aset Lancar', 'name' => 'Reksa Dana'],
            ['code' => '1252', 'category' => 'Aset Lancar', 'name' => 'MTN'],
            ['code' => '1253', 'category' => 'Aset Lancar', 'name' => 'Efek Beragun Aset'],
            ['code' => '1254', 'category' => 'Aset Lancar', 'name' => 'Dana investasi real estat berbentuk kontrak investasi kolektif'],
            ['code' => '1255', 'category' => 'Aset Lancar', 'name' => 'Dana investasi infrastruktur berbentuk kontrak investasi kolektif'],
            ['code' => '1256', 'category' => 'Aset Lancar', 'name' => 'Kontrak opsi dan kontrak berjangka efek yang tercatat di Bursa Efek di Indonesia'],
            ['code' => '1260', 'category' => 'Aset Lancar', 'name' => 'REPO'],
            ['code' => '1261', 'category' => 'Aset Lancar', 'name' => 'Piutang Reverse Repo'],
            ['code' => '1271', 'category' => 'Aset Lancar', 'name' => 'Penyertaan'],
            ['code' => '1272', 'category' => 'Aset Lancar', 'name' => 'Penyertaan langsung'],
            ['code' => '1281', 'category' => 'Aset Lancar', 'name' => 'Tanah di Indonesia'],
            ['code' => '1282', 'category' => 'Aset Lancar', 'name' => 'Bangunan di Indonesia'],
            ['code' => '1283', 'category' => 'Aset Lancar', 'name' => 'Tanah dan Bangunan di Indonesia'],
            ['code' => '1290', 'category' => 'Aset Lancar', 'name' => 'Dikurangi: Akumulasi Penyusutan Bangunan'],
            ['code' => '1291', 'category' => 'Aset Lancar', 'name' => 'Pembiayaan Melalui Kerjasama dengan Pihak Lain (Executing)'],
            ['code' => '1292', 'category' => 'Aset Lancar', 'name' => 'Emas Murni'],
            ['code' => '1293', 'category' => 'Aset Lancar', 'name' => 'Pinjaman yang Dijamin dengan Hak Tanggungan'],
            ['code' => '1294', 'category' => 'Aset Lancar', 'name' => 'Pinjaman Polis'],
            ['code' => '1299', 'category' => 'Aset Lancar', 'name' => 'Investasi Lain'],
            ['code' => '1300', 'category' => 'Aset Lancar', 'name' => 'Jumlah Investasi'],
            ['code' => '1301', 'category' => 'Aset Lancar', 'name' => 'Selisih Penilaian Investasi'],
            ['code' => '1401', 'category' => 'Aset Lancar', 'name' => 'Persediaan'],
            ['code' => '1402', 'category' => 'Aset Lancar', 'name' => 'Persediaan Bahan Baku'],
            ['code' => '1403', 'category' => 'Aset Lancar', 'name' => 'Persediaan Barang Dalam Proses'],
            ['code' => '1404', 'category' => 'Aset Lancar', 'name' => 'Persediaan Barang Jadi'],
            ['code' => '1405', 'category' => 'Aset Lancar', 'name' => 'Aset yang Dimiliki untuk Dijual'],
            ['code' => '1421', 'category' => 'Aset Lancar', 'name' => 'Beban Dibayar di Muka'],
            ['code' => '1422', 'category' => 'Aset Lancar', 'name' => 'Uang Muka'],
            ['code' => '1423', 'category' => 'Aset Lancar', 'name' => 'Pajak Dibayar di Muka'],
            ['code' => '1499', 'category' => 'Aset Lancar', 'name' => 'Aset Lancar Lainnya'],
            ['code' => '1500', 'category' => 'Aset Lancar', 'name' => 'Jumlah Aset Lancar'],
            ['code' => '1501', 'category' => 'Aset Tidak Lancar', 'name' => 'Piutang Jangka Panjang'],
            ['code' => '1511', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi pada Perusahaan Asosiasi, Ventura Bersama, dan Anak Perusahaan'],
            ['code' => '1518', 'category' => 'Aset Tidak Lancar', 'name' => 'Piutang Konsesi Jasa'],
            ['code' => '1519', 'category' => 'Aset Tidak Lancar', 'name' => 'Piutang tidak lancar lainnya'],
            ['code' => '1520', 'category' => 'Aset Tidak Lancar', 'name' => 'Properti Investasi'],
            ['code' => '1521', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Tetap dan Inventaris'],
            ['code' => '1522', 'category' => 'Aset Tidak Lancar', 'name' => 'Dikurangi: Akumulasi penyusutan aset tetap dan inventaris'],
            ['code' => '1523', 'category' => 'Aset Tidak Lancar', 'name' => 'Tanah dan Bangunan'],
            ['code' => '1524', 'category' => 'Aset Tidak Lancar', 'name' => '(Dikurangi: Akumulasi Penyusutan)'],
            ['code' => '1525', 'category' => 'Aset Tidak Lancar', 'name' => 'Peralatan'],
            ['code' => '1526', 'category' => 'Aset Tidak Lancar', 'name' => 'Dikurangi: Akumulasi Penyusutan - Peralatan'],
            ['code' => '1527', 'category' => 'Aset Tidak Lancar', 'name' => 'Mesin'],
            ['code' => '1528', 'category' => 'Aset Tidak Lancar', 'name' => 'Dikurangi: Akumulasi Penyusutan - Mesin'],
            ['code' => '1529', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Tetap Lainnya'],
            ['code' => '1530', 'category' => 'Aset Tidak Lancar', 'name' => '(Dikurangi: Akumulasi Penyusutan)'],
            ['code' => '1531', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Biologis'],
            ['code' => '1533', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Hak Guna'],
            ['code' => '1534', 'category' => 'Aset Tidak Lancar', 'name' => '(Dikurangi: Akumulasi Penyusutan)'],
            ['code' => '1535', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Non Produktif'],
            ['code' => '1541', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi pada Perusahaan Asosiasi'],
            ['code' => '1542', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi yang dicatat dengan menggunakan metode ekuitas'],
            ['code' => '1551', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi pada Perusahaan Asosiasi, Ventura Bersama, dan Anak Perusahaan'],
            ['code' => '1555', 'category' => 'Aset Tidak Lancar', 'name' => 'Penyertaan Modal Pada Bank'],
            ['code' => '1556', 'category' => 'Aset Tidak Lancar', 'name' => 'Penyertaan Modal pada Perusahaan Jasa Keuangan Lainnya'],
            ['code' => '1561', 'category' => 'Aset Tidak Lancar', 'name' => 'Sewa Pembiayaan'],
            ['code' => '1571', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Keuangan-Tidak Lancar'],
            ['code' => '1573', 'category' => 'Aset Tidak Lancar', 'name' => 'Beban dibayar di muka-tidak lancar'],
            ['code' => '1574', 'category' => 'Aset Tidak Lancar', 'name' => 'Pajak dibayar di muka-tidak lancar'],
            ['code' => '1583', 'category' => 'Aset Tidak Lancar', 'name' => 'Persediaan tidak lancar'],
            ['code' => '1590', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi jangka panjang dalam Surat Berharga'],
            ['code' => '1599', 'category' => 'Aset Tidak Lancar', 'name' => 'Investasi Jangka Panjang Lainnya'],
            ['code' => '1600', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Tak Berwujud - Net'],
            ['code' => '1601', 'category' => 'Aset Tidak Lancar', 'name' => '(Dikurangi: Akumulasi Amortisasi)'],
            ['code' => '1611', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Pajak Tangguhan'],
            ['code' => '1612', 'category' => 'Aset Tidak Lancar', 'name' => 'Beban tangguhan'],
            ['code' => '1613', 'category' => 'Aset Tidak Lancar', 'name' => 'Biaya Akuisisi yang Ditangguhkan'],
            ['code' => '1621', 'category' => 'Aset Tidak Lancar', 'name' => 'Properti investasi'],
            ['code' => '1631', 'category' => 'Aset Tidak Lancar', 'name' => 'Salam'],
            ['code' => '1633', 'category' => 'Aset Tidak Lancar', 'name' => "Aset Istishna' dalam penyelesaian"],
            ['code' => '1634', 'category' => 'Aset Tidak Lancar', 'name' => 'Termin Istishna\''],
            ['code' => '1651', 'category' => 'Aset Tidak Lancar', 'name' => 'Klaim atas Pengembalian Pajak'],
            ['code' => '1655', 'category' => 'Aset Tidak Lancar', 'name' => 'Hak Konsesi'],
            ['code' => '1658', 'category' => 'Aset Tidak Lancar', 'name' => '(Cadangan Kerugian Penurunan Nilai)'],
            ['code' => '1679', 'category' => 'Aset Tidak Lancar', 'name' => 'Jumlah Aset Operasional'],
            ['code' => '1698', 'category' => 'Aset Tidak Lancar', 'name' => 'Aset Tidak Lancar Lainnya'],
            ['code' => '1699', 'category' => 'Aset Tidak Lancar', 'name' => 'Jumlah Aset Tidak Lancar'],
            ['code' => '1700', 'category' => 'Jumlah Aset', 'name' => 'Jumlah Aset'],
            ['code' => '2102', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Usaha - Pihak Ketiga'],
            ['code' => '2103', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Usaha - Pihak yang Mempunyai Hubungan Istimewa'],
            ['code' => '2111', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Bunga'],
            ['code' => '2121', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Usaha'],
            ['code' => '2122', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Surat Utang Jangka Pendek'],
            ['code' => '2123', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Repo'],
            ['code' => '2124', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Obligasi'],
            ['code' => '2126', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang pada Lembaga Kliring dan Penjaminan'],
            ['code' => '2131', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Nasabah - Pihak Berelasi'],
            ['code' => '2132', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Nasabah - Pihak Ketiga'],
            ['code' => '2133', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Perusahaan Efek lain'],
            ['code' => '2134', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Kegiatan Manajer Investasi'],
            ['code' => '2135', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Kegiatan Penjaminan Emisi Efek'],
            ['code' => '2140', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Giro'],
            ['code' => '2141', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Tabungan'],
            ['code' => '2142', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Dana investasi non profit sharing (Giro + Tabungan + Deposito)'],
            ['code' => '2151', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Uang Jaminan Jangka Pendek'],
            ['code' => '2152', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Simpanan berjangka'],
            ['code' => '2155', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang atas surat berharga yang dijual dengan janji dibeli kembali (repo)'],
            ['code' => '2156', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas spot dan derivatif'],
            ['code' => '2157', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Akseptasi'],
            ['code' => '2160', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Dana investasi revenue sharing'],
            ['code' => '2161', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas kepada bank lain'],
            ['code' => '2162', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Pinjaman dari Bank Indonesia'],
            ['code' => '2163', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Pinjaman dari Bank Lain'],
            ['code' => '2164', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas Derivatif'],
            ['code' => '2165', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Reasuransi'],
            ['code' => '2166', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Komisi'],
            ['code' => '2167', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Klaim'],
            ['code' => '2168', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Koasuransi'],
            ['code' => '2171', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Cadangan Premi'],
            ['code' => '2172', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Cadangan atas Premi Yang Belum Merupakan Pendapatan (CAPYBMP)'],
            ['code' => '2173', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Cadangan Klaim'],
            ['code' => '2174', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Cadangan atas Risiko Bencana'],
            ['code' => '2181', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabiltas Manfaat Pensiun'],
            ['code' => '2183', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Manfaat Pensiun dan Manfaat Lain Jatuh Tempo'],
            ['code' => '2184', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Manfaat Sukarela'],
            ['code' => '2185', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Investasi'],
            ['code' => '2186', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas Kontrak'],
            ['code' => '2187', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas Sewa Jangka Pendek'],
            ['code' => '2191', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Pajak'],
            ['code' => '2192', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Dividen'],
            ['code' => '2193', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Proyek'],
            ['code' => '2194', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Lainnya'],
            ['code' => '2195', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Beban yang Masih Harus Dibayar'],
            ['code' => '2201', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Bank Jangka Pendek'],
            ['code' => '2202', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Utang Jangka Panjang yang Jatuh Tempo dalam Satu Tahun'],
            ['code' => '2203', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Pendapatan Diterima di Muka'],
            ['code' => '2204', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Surat Berharga yang Diterbitkan'],
            ['code' => '2205', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas akseptasi'],
            ['code' => '2211', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Pinjaman yang Diterima'],
            ['code' => '2212', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas Sewa'],
            ['code' => '2213', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Pinjaman yang Diterima dari Luar Negeri'],
            ['code' => '2214', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Setoran Jaminan'],
            ['code' => '2221', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Dana Investasi Profit Sharing'],
            ['code' => '2228', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Liabilitas Jangka Pendek Lainnya'],
            ['code' => '2229', 'category' => 'Liabilitas Jangka Pendek', 'name' => 'Jumlah Liabilitas Jangka Pendek'],
            ['code' => '2301', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Utang Bank Jangka Panjang'],
            ['code' => '2302', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Pinjaman Jangka Panjang-Surat Berharga'],
            ['code' => '2303', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Utang Jangka Panjang-Pihak Ketiga'],
            ['code' => '2304', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Utang Jangka Panjang - Pihak yang Mempunyai Hubungan Istimewa'],
            ['code' => '2306', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Pinjaman Jangka Panjang-Lainnya'],
            ['code' => '2311', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Kontrak'],
            ['code' => '2312', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Sewa Jangka Panjang'],
            ['code' => '2314', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Pajak Tangguhan'],
            ['code' => '2321', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Pajak Tangguhan'],
            ['code' => '2322', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Imbalan Kerja'],
            ['code' => '2323', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Imbalan Kerja'],
            ['code' => '2341', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Uang Jaminan Jangka Panjang'],
            ['code' => '2342', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Uang Muka Pelanggan Jangka Panjang'],
            ['code' => '2344', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Utang Pihak Berelasi Jangka Panjang'],
            ['code' => '2345', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Utang Pemegang Saham Jangka Panjang'],
            ['code' => '2361', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Pinjaman Subordinasi'],
            ['code' => '2362', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Pinjaman Subordinasi Dalam Negeri'],
            ['code' => '2363', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Pinjaman Subordinasi Luar Negeri'],
            ['code' => '2900', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Jumlah Liabilitas Jangka Panjang'],
            ['code' => '2988', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Lainnya'],
            ['code' => '2998', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Liabilitas Jangka Panjang Lainnya'],
            ['code' => '2999', 'category' => 'Liabilitas Jangka Panjang', 'name' => 'Jumlah Liabilitas'],
            ['code' => '3102', 'category' => 'Ekuitas', 'name' => 'Modal Saham'],
            ['code' => '3110', 'category' => 'Ekuitas', 'name' => 'Simpanan Pokok dan Simpanan Wajib'],
            ['code' => '3120', 'category' => 'Ekuitas', 'name' => 'Tambahan Modal Disetor'],
            ['code' => '3200', 'category' => 'Ekuitas', 'name' => 'Saldo Laba'],
            ['code' => '3297', 'category' => 'Ekuitas', 'name' => 'Pendapatan Komprehensif Lainnya'],
            ['code' => '3298', 'category' => 'Ekuitas', 'name' => 'Ekuitas Lainnya'],
            ['code' => '3299', 'category' => 'Ekuitas', 'name' => 'Jumlah Ekuitas'],
            ['code' => '3300', 'category' => 'Jumlah Liabilitas & Ekuitas', 'name' => 'Jumlah Liabilitas dan Ekuitas'],
            ['code' => '4001', 'category' => 'Penjualan', 'name' => 'Penjualan dan Pendapatan Usaha'],
            ['code' => '4002', 'category' => 'Penjualan', 'name' => 'Penjualan Domestik'],
            ['code' => '4003', 'category' => 'Penjualan', 'name' => 'Penjualan Ekspor'],
            ['code' => '4004', 'category' => 'Penjualan', 'name' => 'Penjualan Bruto'],
            ['code' => '4011', 'category' => 'Dukurangi :', 'name' => 'Retur'],
            ['code' => '4012', 'category' => 'Dukurangi :', 'name' => 'Potongan Penjualan'],
            ['code' => '4013', 'category' => 'Dukurangi :', 'name' => 'Penyesuaian Penjualan'],
            ['code' => '4020', 'category' => 'Dukurangi :', 'name' => 'Penjualan Bersih'],
            ['code' => '4021', 'category' => 'Dukurangi :', 'name' => 'Pendapatan Jasa'],
            ['code' => '4026', 'category' => 'Pendapatan Investasi', 'name' => 'Bunga/Bagi Hasil'],
            ['code' => '4027', 'category' => 'Pendapatan Bunga', 'name' => 'Pendapatan Bunga - Rupiah'],
            ['code' => '4028', 'category' => 'Pendapatan Bunga', 'name' => 'Pendapatan Bunga - Valuta Asing'],
            ['code' => '4030', 'category' => 'Pendapatan Bunga', 'name' => 'Laba Kotor'],
            ['code' => '4031', 'category' => 'Beban Bunga', 'name' => 'Beban Bunga - Rupiah'],
            ['code' => '4033', 'category' => 'Beban Bunga', 'name' => 'Beban Bunga - Valuta Asing'],
            ['code' => '4040', 'category' => 'Beban Bunga', 'name' => 'Pendapatan (Beban) Bunga bersih'],
            ['code' => '4041', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Premi'],
            ['code' => '4045', 'category' => 'Beban Bunga', 'name' => 'Komisi Dibayar'],
            ['code' => '4047', 'category' => 'Beban Bunga', 'name' => 'Premi Reasuransi'],
            ['code' => '4051', 'category' => 'Beban Bunga', 'name' => 'Penurunan (Kenaikan) Cadangan Premi, CAPYBMP, dan Risiko Bencana'],
            ['code' => '4060', 'category' => 'Beban Bunga', 'name' => 'Jumlah Pendapatan Premi Neto'],
            ['code' => '4061', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Bunga dari Pembiayaan Investasi'],
            ['code' => '4062', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Bunga dari Pembiayaan Modal Kerja'],
            ['code' => '4063', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Bunga dari Pembiayaan Multiguna'],
            ['code' => '4064', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Bagi Hasil dari Kegiatan Pembiayaan Investasi (prinsip syariah)'],
            ['code' => '4065', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Margin dari Kegiatan Pembiayaan Jual Beli (prinsip syariah)'],
            ['code' => '4066', 'category' => 'Beban Bunga', 'name' => 'Pendapatan Imbal Jasa dari Pembiayaan Jasa (prinsip syariah)'],
            ['code' => '4071', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Keuntungan dari peningkatan nilai wajar aset keuangan'],
            ['code' => '4072', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Keuntungan dari penurunan nilai wajar liabilitas keuangan'],
            ['code' => '4073', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Keuntungan dari penjualan aset keuangan'],
            ['code' => '4074', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Keuntungan dari transaksi spot dan derivatif'],
            ['code' => '4081', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan Kegiatan Perantara Perdagangan Efek'],
            ['code' => '4082', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan Kegiatan Penjaminan Emisi Efek'],
            ['code' => '4083', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan Kegiatan Manajer Investasi'],
            ['code' => '4084', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan bank selaku mudharib dalam mudharabah muqayyadah'],
            ['code' => '4091', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Dividen'],
            ['code' => '4092', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Keuntungan dari penyertaan dengan equity method'],
            ['code' => '4093', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Komisi/provisi/fee dan administrasi'],
            ['code' => '4094', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pemulihan atas cadangan kerugian penurunan nilai'],
            ['code' => '4101', 'category' => 'Pendapatan Investasi', 'name' => 'Sewa'],
            ['code' => '4106', 'category' => 'Pendapatan Investasi', 'name' => 'Laba (Rugi) Pelepasan Investasi'],
            ['code' => '4118', 'category' => 'Pendapatan Investasi', 'name' => 'Pendapatan Investasi Lain'],
            ['code' => '4119', 'category' => 'Pendapatan Investasi', 'name' => 'Pendapatan Usaha Lainnya'],
            ['code' => '4120', 'category' => 'Pendapatan Investasi', 'name' => 'Jumlah Pendapatan Investasi'],
            ['code' => '4121', 'category' => 'Pendapatan dari Piutang', 'name' => 'Murabaha'],
            ['code' => '4122', 'category' => 'Pendapatan dari Piutang', 'name' => 'Istishna\''],
            ['code' => '4123', 'category' => 'Pendapatan dari Piutang', 'name' => 'Ujrah'],
            ['code' => '4130', 'category' => 'Pendapatan dari Piutang', 'name' => 'Total pendapatan dari piutang'],
            ['code' => '4131', 'category' => 'Pendapatan Bagi Hasil', 'name' => 'Mudharabah'],
            ['code' => '4132', 'category' => 'Pendapatan Bagi Hasil', 'name' => 'Musyarakah'],
            ['code' => '4140', 'category' => 'Pendapatan Bagi Hasil', 'name' => 'Jumlah pendapatan bagi hasil'],
            ['code' => '4149', 'category' => 'Pendapatan Bagi Hasil', 'name' => 'Pendapatan lainnya dari Penyaluran Dana'],
            ['code' => '4150', 'category' => 'Pendapatan Bagi Hasil', 'name' => 'Jumlah pendapatan dari penyaluran dana'],
            ['code' => '4153', 'category' => 'Beban Usaha', 'name' => 'Keuntungan (Kerugian) selisih kurs mata uang asing'],
            ['code' => '4154', 'category' => 'Beban Usaha', 'name' => 'Bagian atas laba (rugi) entitas asosiasi yang dicatat dengan menggunakan metode ekuitas'],
            ['code' => '4155', 'category' => 'Beban Usaha', 'name' => 'Bagian atas laba (rugi) entitas ventura bersama yang dicatat menggunakan metode ekuitas'],
            ['code' => '4156', 'category' => 'Beban Usaha', 'name' => 'Keuntungan (kerugian) instrumen keuangan derivatif'],
            ['code' => '4161', 'category' => 'Beban Usaha', 'name' => 'Keuntungan Penjualan Aset selain Persediaan'],
            ['code' => '4171', 'category' => 'Beban Usaha', 'name' => 'Pendapatan Underwriting Lain-Neto'],
            ['code' => '4199', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan Usaha Lainnya'],
            ['code' => '4201', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Jumlah Pendapatan Usaha'],
            ['code' => '4210', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Jumlah Pendapatan Operasional Lain'],
            ['code' => '4220', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Pendapatan (Beban) Operasional Lain'],
            ['code' => '4300', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Laba Kotor'],
            ['code' => '4400', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Laba (Rugi) Operasional Lain-Bersih'],
            ['code' => '4500', 'category' => 'Pendapatan Operasional Lain', 'name' => 'Laba (Rugi) Usaha'],
            ['code' => '4501', 'category' => 'Pendapatan Non Usaha', 'name' => 'Keuntungan Selisih Kurs'],
            ['code' => '4502', 'category' => 'Pendapatan Non Usaha', 'name' => 'Keuntungan penjualan aset tetap dan inventaris'],
            ['code' => '4503', 'category' => 'Pendapatan Non Usaha', 'name' => 'Keuntungan Penjualan Aset selain Persediaan'],
            ['code' => '4511', 'category' => 'Pendapatan Non Usaha', 'name' => 'Pendapatan Bunga'],
            ['code' => '4512', 'category' => 'Laba Rugi Non Operasional', 'name' => 'Bunga Keterlambatan Iuran'],
            ['code' => '4513', 'category' => 'Laba Rugi Non Operasional', 'name' => 'Laba (Rugi) Penjualan Aset Operasional'],
            ['code' => '4514', 'category' => 'Laba Rugi Non Operasional', 'name' => 'Laba (Rugi) Penjualan Aset Lain-Lain'],
            ['code' => '4599', 'category' => 'Pendapatan Non Usaha', 'name' => 'Pendapatan Non Usaha Lainnya'],
            ['code' => '4600', 'category' => 'Pendapatan Non Usaha', 'name' => 'Jumlah Pendapatan Non Usaha'],
            ['code' => '4700', 'category' => 'Pendapatan Non Usaha', 'name' => 'Laba (Rugi) Non Usaha'],
            ['code' => '4800', 'category' => 'Pendapatan Non Usaha', 'name' => 'Laba (Rugi) Sebelum Pajak'],
            ['code' => '4900', 'category' => 'Pendapatan Non Usaha', 'name' => 'Laba (Rugi) Setelah Pajak'],
            ['code' => '5001', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Pembelian'],
            ['code' => '5003', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Beban Pengangkutan'],
            ['code' => '5007', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Beban Lainnya'],
            ['code' => '5008', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Persediaan - Awal'],
            ['code' => '5009', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Dikurangi: Persediaan - Akhir'],
            ['code' => '5020', 'category' => 'Harga Pokok Penjualan (HPP)', 'name' => 'Jumlah HPP'],
            ['code' => '5021', 'category' => 'Biaya Pabrikasi', 'name' => 'Persediaan Awal Bahan Baku'],
            ['code' => '5022', 'category' => 'Biaya Pabrikasi', 'name' => 'Pembelian Bahan Baku'],
            ['code' => '5029', 'category' => 'Biaya Pabrikasi', 'name' => '(Retur Pembelian Bahan Baku)'],
            ['code' => '5030', 'category' => 'Biaya Pabrikasi', 'name' => 'Jumlah Pembelian Bahan Baku'],
            ['code' => '5031', 'category' => 'Biaya Pabrikasi', 'name' => 'Bahan Baku Yang Tersedia Untuk Produksi'],
            ['code' => '5032', 'category' => 'Biaya Pabrikasi', 'name' => '(Persediaan Akhir Bahan Baku)'],
            ['code' => '5040', 'category' => 'Biaya Pabrikasi', 'name' => 'Jumlah Biaya Bahan Baku'],
            ['code' => '5050', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Tenaga Kerja Langsung'],
            ['code' => '5051', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Tenaga Kerja Tidak Langsung'],
            ['code' => '5052', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Pemeliharaan dan Perbaikan Mesin'],
            ['code' => '5058', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Penyusutan dan Amortisasi'],
            ['code' => '5059', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Utilitas'],
            ['code' => '5069', 'category' => 'Biaya Pabrikasi', 'name' => 'Biaya Pabrikasi Lainnya (termasuk pita cukai)'],
            ['code' => '5070', 'category' => 'Biaya Pabrikasi', 'name' => 'Jumlah Biaya Pabrikasi'],
            ['code' => '5080', 'category' => 'Biaya Pabrikasi', 'name' => 'Jumlah Biaya Produksi'],
            ['code' => '5090', 'category' => 'Biaya Pabrikasi', 'name' => 'Persediaan Awal Barang Dalam Proses'],
            ['code' => '5099', 'category' => 'Biaya Pabrikasi', 'name' => '(Persediaan Akhir Barang Dalam Proses)'],
            ['code' => '5100', 'category' => 'Biaya Pabrikasi', 'name' => 'Jumlah Harga Pokok Produksi'],
            ['code' => '5101', 'category' => 'Beban Underwriting', 'name' => 'Klaim Bruto'],
            ['code' => '5102', 'category' => 'Beban Underwriting', 'name' => 'Klaim Reasuransi'],
            ['code' => '5103', 'category' => 'Beban Underwriting', 'name' => 'Kenaikan (Penurunan) Cadangan Klaim'],
            ['code' => '5109', 'category' => 'Beban Underwriting', 'name' => 'Beban Underwriting Lain-Neto'],
            ['code' => '5200', 'category' => 'Beban Underwriting', 'name' => 'Jumlah Beban Underwriting'],
            ['code' => '5201', 'category' => 'Beban Investasi', 'name' => 'Beban Transaksi'],
            ['code' => '5202', 'category' => 'Beban Investasi', 'name' => 'Beban Pemeliharaan Tanah dan Bangunan'],
            ['code' => '5203', 'category' => 'Beban Investasi', 'name' => 'Beban Penyusutan Bangunan'],
            ['code' => '5204', 'category' => 'Beban Investasi', 'name' => 'Beban Manajer Investasi'],
            ['code' => '5205', 'category' => 'Beban Investasi', 'name' => 'Beban Kustodi'],
            ['code' => '5299', 'category' => 'Beban Investasi', 'name' => 'Beban Investasi Lain'],
            ['code' => '5300', 'category' => 'Beban Investasi', 'name' => 'Jumlah Beban Investasi'],
            ['code' => '5301', 'category' => 'Beban Investasi', 'name' => 'Non profit sharing'],
            ['code' => '5302', 'category' => 'Beban Investasi', 'name' => 'Profit sharing'],
            ['code' => '5310', 'category' => 'Beban Investasi', 'name' => 'Jumlah bagi hasil untuk pemilik dana investasi'],
            ['code' => '5311', 'category' => 'Beban Usaha', 'name' => 'Gaji, Tunjangan, Bonus, Honorarium, THR, dsb'],
            ['code' => '5312', 'category' => 'Beban Usaha', 'name' => 'Beban Imbalan Kerja Lainnya'],
            ['code' => '5313', 'category' => 'Beban Usaha', 'name' => 'Beban Transportasi'],
            ['code' => '5314', 'category' => 'Beban Usaha', 'name' => 'Beban Penyusutan dan Amortisasi'],
            ['code' => '5315', 'category' => 'Beban Usaha', 'name' => 'Beban Sewa'],
            ['code' => '5316', 'category' => 'Beban Usaha', 'name' => 'Beban Bunga'],
            ['code' => '5317', 'category' => 'Beban Usaha', 'name' => 'Beban Sehubungan dengan Jasa'],
            ['code' => '5318', 'category' => 'Beban Usaha', 'name' => 'Beban Penurunan Nilai'],
            ['code' => '5319', 'category' => 'Beban Usaha', 'name' => 'Beban Royalti'],
            ['code' => '5320', 'category' => 'Beban Usaha', 'name' => 'Beban Pemasaran atau Promosi'],
            ['code' => '5321', 'category' => 'Beban Usaha', 'name' => 'Beban Entertainment'],
            ['code' => '5322', 'category' => 'Beban Usaha', 'name' => 'Beban Umum dan Administrasi'],
            ['code' => '5323', 'category' => 'Beban Usaha', 'name' => 'Beban Kantor'],
            ['code' => '5324', 'category' => 'Beban Usaha', 'name' => 'Beban Penjualan'],
            ['code' => '5325', 'category' => 'Beban Usaha', 'name' => 'Beban Interkoneksi'],
            ['code' => '5326', 'category' => 'Beban Usaha', 'name' => 'Beban Pemeliharaan'],
            ['code' => '5327', 'category' => 'Beban Usaha', 'name' => 'Beban Premi Asuransi'],
            ['code' => '5328', 'category' => 'Beban Usaha', 'name' => 'Beban Premi atas Transaksi Swap'],
            ['code' => '5341', 'category' => 'Beban Usaha', 'name' => 'Beban bonus wadiah'],
            ['code' => '5342', 'category' => 'Beban Usaha', 'name' => 'Kerugian dari penurunan nilai wajar aset keuangan'],
            ['code' => '5343', 'category' => 'Beban Usaha', 'name' => 'Kerugian penjualan aset (Aset surat berharga and Ijarah)'],
            ['code' => '5344', 'category' => 'Beban Usaha', 'name' => 'Kerugian transaksi spot dan forward (realized)'],
            ['code' => '5345', 'category' => 'Beban Usaha', 'name' => 'Kerugian penurunan nilai aset keuangan (impairment)'],
            ['code' => '5346', 'category' => 'Beban Usaha', 'name' => 'Kerugian terkait risiko operasional'],
            ['code' => '5347', 'category' => 'Beban Usaha', 'name' => 'Kerugian dari penyertaan dengan equity method'],
            ['code' => '5348', 'category' => 'Beban Usaha', 'name' => 'Komisi/provisi/fee dan administrasi'],
            ['code' => '5349', 'category' => 'Beban Usaha', 'name' => 'Kerugian penurunan nilai aset lainnya (non keuangan)'],
            ['code' => '5350', 'category' => 'Beban Operasional Lain', 'name' => 'Penurunan nilai wajar aset keuangan'],
            ['code' => '5351', 'category' => 'Beban Operasional Lain', 'name' => 'Peningkatan nilai wajar liabilitas keuangan'],
            ['code' => '5352', 'category' => 'Beban Operasional Lain', 'name' => 'Kerugian atas penjualan aset keuangan'],
            ['code' => '5353', 'category' => 'Beban Operasional Lain', 'name' => 'Kerugian transaksi spot dan derivatif'],
            ['code' => '5354', 'category' => 'Beban Operasional Lain', 'name' => 'Kerugian penurunan nilai aset keuangan'],
            ['code' => '5356', 'category' => 'Beban Operasional Lain', 'name' => 'Kerugian dari penyertaan dengan equity method'],
            ['code' => '5358', 'category' => 'Beban Operasional Lain', 'name' => 'Kerugian penurunan nilai aset lainnya (non keuangan)'],
            ['code' => '5399', 'category' => 'Beban Operasional Lain', 'name' => 'Beban Usaha Lainnya'],
            ['code' => '5400', 'category' => 'Beban Operasional Lain', 'name' => 'Jumlah Beban Usaha'],
            ['code' => '5401', 'category' => 'Beban Operasional Lain', 'name' => 'Total Beban Operasional Lain'],
            ['code' => '5405', 'category' => 'Beban Non Usaha', 'name' => 'Kerugian Penjualan Aset selain Persediaan'],
            ['code' => '5409', 'category' => 'Beban Non Usaha', 'name' => 'Sumbangan'],
            ['code' => '5412', 'category' => 'Beban Non Usaha', 'name' => 'Kerugian Selisih Kurs'],
            ['code' => '5421', 'category' => 'Beban Non Usaha', 'name' => 'Kerugian Selisih Kurs'],
            ['code' => '5422', 'category' => 'Beban Non Usaha', 'name' => 'Kerugian penjualan aset tetap dan inventaris'],
            ['code' => '5499', 'category' => 'Beban Non Usaha', 'name' => 'Beban Non Usaha Lainnya'],
            ['code' => '5500', 'category' => 'Beban Non Usaha', 'name' => 'Jumlah Beban Non Usaha'],
            ['code' => '5901', 'category' => 'Beban Non Usaha', 'name' => 'Beban Pajak Penghasilan'],
            ['code' => '5969', 'category' => 'Biaya Overhead Pabrik', 'name' => 'Biaya Overhead Lainnya'],
            
        ];

        $map = [];
        foreach ($rows as $index => $row) {
            $code = (string) ($row['code'] ?? '');
            if ($code === '') {
                continue;
            }
            $map[$code] = [
                'id' => $index + 1,
                'code' => $code,
                'category' => (string) ($row['category'] ?? ''),
                'name' => (string) ($row['name'] ?? ''),
            ];
        }

        return $map;
    }

    /**
     * Store or update SPT Badan data
     */
    public function store(Request $request)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return redirect()->route('spt.konsep')->with('error', 'Active course belum dipilih.');
        }

        $activeBusinessEntityId = session('active_business_entity_id');
        if (!$activeBusinessEntityId) {
            return redirect()->route('spt.konsep')->with('error', 'Badan usaha aktif belum dipilih.');
        }

        $user = Auth::user();
        $activeBusinessEntity = BusinessEntity::query()
            ->where('id', $activeBusinessEntityId)
            ->where('user_id', $user->id)
            ->first();

        if (!$activeBusinessEntity) {
            session()->forget('active_business_entity_id');
            return redirect()->route('spt.konsep')->with('error', 'Badan usaha aktif tidak ditemukan.');
        }

        // Validate password
        $password = $request->input('password');
        if (!Hash::check($password, $user->password)) {
            $sptId = $request->input('spt_id');
            return redirect()->route('spt.detailBadan', ['id' => $sptId])->with('error', 'Password salah!');
        }

        try {
            $sptId = $request->input('spt_id');

            // Verify SPT belongs to active course
            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
                ->whereHas('form', function ($q) {
                    $q->where('code', 'PPHBADAN');
                })
                ->findOrFail($sptId);

            $existingSptBadan = SptBadan::where('spt_id', $sptId)->first();
            if ($existingSptBadan && $existingSptBadan->business_entity_id !== $activeBusinessEntity->id) {
                return redirect()->route('spt.konsep')->with('error', 'Anda tidak memiliki akses ke SPT Badan ini.');
            }

            // Create or update SptBadan
            $sptBadanData = $this->extractSptBadanData($request);
            $sptBadanData['spt_id'] = $sptId;
            $sptBadanData['business_entity_id'] = $activeBusinessEntity->id;

            $sptBadan = SptBadan::updateOrCreate(
                [
                    'spt_id' => $sptId,
                    'business_entity_id' => $activeBusinessEntity->id,
                ],
                $sptBadanData
            );

            // Handle payment method
            $paymentMethod = $request->input('payment_method');
            // f_17c = PPh yang masih harus dibayar atau lebih dibayar (nilai akhir)
            $taxValue = (int) ($sptBadan->f_17c ?? 0);

            if ($paymentMethod === 'billing' || $paymentMethod === 'deposit') {
                $this->handlePayment($request, $user, $spt, $sptBadan, $activeCourseId, $paymentMethod, $taxValue);
            }

            // Update SPT status
            if ($paymentMethod === 'deposit' || $paymentMethod === 'spt') {
                $spt->status       = 'approved';
                $spt->payment_value = $taxValue;
                $spt->paid_date    = now();
            } elseif ($paymentMethod === 'billing') {
                $spt->status = 'waiting';
            }

            $spt->tax_value = $taxValue;

            // Generate NTTE
            $year     = $spt->year;
            $sptCount = Spt::whereYear('created_at', $year)
                ->whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                    $q->where('course_id', $activeCourseId);
                })
                ->whereNotNull('ntte')
                ->count();
            $seq      = str_pad($sptCount + 1, 5, '0', STR_PAD_LEFT);
            $spt->ntte = "BPE-{$seq}/CT/KPP/{$year}";
            $spt->save();

            if ($paymentMethod === 'deposit') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melakukan Pembayaran dengan Saldo Deposit.');
            } elseif ($paymentMethod === 'billing') {
                return redirect()->route('payment.billing')->with('success', 'Berhasil Membuat Kode Billing.');
            } elseif ($paymentMethod === 'spt') {
                return redirect()->route('spt.submitted')->with('success', 'Berhasil Melaporkan SPT.');
            }

            return redirect()->route('spt.detailBadan', ['id' => $sptId])->with('success', 'Data SPT Badan berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Save draft without submission
     */
    public function saveDraft(Request $request)
    {
        $activeCourseId = session('active_course_id');
        if (!$activeCourseId) {
            return response()->json(['error' => 'Active course belum dipilih.'], 400);
        }

        $activeBusinessEntityId = session('active_business_entity_id');
        if (!$activeBusinessEntityId) {
            return response()->json(['error' => 'Badan usaha aktif belum dipilih.'], 400);
        }

        try {
            $sptId = $request->input('spt_id');
            $user = Auth::user();
            $activeBusinessEntity = BusinessEntity::query()
                ->where('id', $activeBusinessEntityId)
                ->where('user_id', $user->id)
                ->first();

            if (!$activeBusinessEntity) {
                session()->forget('active_business_entity_id');
                return response()->json(['error' => 'Badan usaha aktif tidak ditemukan.'], 404);
            }

            $spt = Spt::whereHas('courseResults.courseUser', function ($q) use ($activeCourseId) {
                $q->where('course_id', $activeCourseId);
            })
                ->whereHas('form', function ($q) {
                    $q->where('code', 'PPHBADAN');
                })
                ->findOrFail($sptId);

            $existingSptBadan = SptBadan::where('spt_id', $sptId)->first();
            if ($existingSptBadan && $existingSptBadan->business_entity_id !== $activeBusinessEntity->id) {
                return response()->json(['error' => 'Anda tidak memiliki akses ke SPT Badan ini.'], 403);
            }

            $sptBadanData            = $this->extractSptBadanData($request);
            $sptBadanData['spt_id']  = $sptId;
            $sptBadanData['business_entity_id'] = $activeBusinessEntity->id;

            SptBadan::updateOrCreate(
                [
                    'spt_id' => $sptId,
                    'business_entity_id' => $activeBusinessEntity->id,
                ],
                $sptBadanData
            );

            return response()->json(['success' => true, 'message' => 'Draft berhasil disimpan.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    private function extractSptBadanData(Request $request): array
    {
        $payload = $request->input('spt_badan_data');
        if (!is_array($payload)) {
            $payload = $request->all();
        }

        $columns = Schema::getColumnListing('spt_badan');
        $data    = array_intersect_key($payload, array_flip($columns));
        unset($data['id'], $data['created_at'], $data['updated_at']);

        return $data;
    }

    /**
     * Handle payment for SPT Badan
     */
    private function handlePayment(Request $request, $user, $spt, $sptBadan, $activeCourseId, $paymentMethod, $taxValue)
    {
        $lastBillingFormId = Billing::max('billing_form_id') ?? 0;
        $billingFormId     = $lastBillingFormId + 1;

        $billingData = $request->input('billing_data');
        $billing     = new Billing([
            'user_id'          => $user->id,
            'spt_id'           => $spt->id,
            'billing_type_id'  => $billingData['billing_type_id'],
            'billing_form_id'  => $billingFormId,
            'start_period'     => $billingData['start_period'],
            'end_period'       => $billingData['end_period'],
            'year'             => $billingData['year'],
            'currency'         => $billingData['currency'],
            'amount'           => $billingData['amount'],
            'amount_in_words'  => $billingData['amount_in_words'],
            'description'      => $billingData['description'],
            'status'           => $paymentMethod === 'deposit' ? 'paid' : 'unpaid',
            'active_period'    => $billingData['active_period'],
            'code'             => $billingData['code'],
        ]);
        $billing->save();

        $courseUser = CourseUser::firstOrCreate([
            'user_id'   => $user->id,
            'course_id' => $activeCourseId,
        ]);

        $billingLinked = CourseResult::where('course_user_id', $courseUser->id)
            ->where('billing_id', $billing->id)
            ->first();

        if (!$billingLinked) {
            CourseResult::create([
                'course_user_id' => $courseUser->id,
                'billing_id'     => $billing->id,
                'spt_id'         => $spt->id,
            ]);
        }

        $ledgerData     = $request->input('ledger_data');
        $correctionType = $spt->correction_number == 1 ? 'spt pembetulan' : 'spt normal';

        if ($paymentMethod === 'billing') {
            $ledger = new Ledger([
                'user_id'                => $user->id,
                'billing_id'             => $billing->id,
                'billing_type_id'        => $ledgerData['billing_type_id'],
                'transaction_date'       => $ledgerData['transaction_date'],
                'posting_date'           => $ledgerData['posting_date'],
                'accounting_type'        => $ledgerData['accounting_type'],
                'accounting_type_detail' => $correctionType,
                'currency'               => $ledgerData['currency'],
                'transaction_type'       => $ledgerData['transaction_type'],
                'debit_amount'           => -$billingData['amount'],
                'debit_unpaid'           => 0,
                'credit_amount'          => 0,
                'credit_left'            => 0,
                'kap'                    => $ledgerData['kap'],
                'kap_description'        => $ledgerData['kap_description'],
                'kjs'                    => $ledgerData['kjs'],
                'tax_period'             => $ledgerData['tax_period'],
                'transaction_number'     => $ledgerData['transaction_number'],
            ]);
            $ledger->save();

            CourseResult::firstOrCreate([
                'course_user_id' => $courseUser->id,
                'billing_id'     => $billing->id,
                'ledger_id'      => $ledger->id,
                'spt_id'         => $spt->id,
            ]);
        } elseif ($paymentMethod === 'deposit') {
            $ledgerEntries = [
                ['accounting_type' => 'pembayaran',        'transaction_type' => 'credit', 'accounting_type_detail' => 'pemindahbukuan'],
                ['accounting_type' => 'penyesuaian',       'transaction_type' => 'debit',  'accounting_type_detail' => 'pemindahbukuan'],
                ['accounting_type' => 'surat pemberitahuan', 'transaction_type' => 'credit', 'accounting_type_detail' => $correctionType],
            ];

            foreach ($ledgerEntries as $entry) {
                $ledger = new Ledger([
                    'user_id'                => $user->id,
                    'billing_id'             => $billing->id,
                    'billing_type_id'        => $ledgerData['billing_type_id'],
                    'transaction_date'       => $ledgerData['transaction_date'],
                    'posting_date'           => $ledgerData['posting_date'],
                    'accounting_type'        => $entry['accounting_type'],
                    'accounting_type_detail' => $entry['accounting_type_detail'],
                    'currency'               => $ledgerData['currency'],
                    'transaction_type'       => $entry['transaction_type'],
                    'debit_amount'           => in_array($entry['accounting_type'], ['pembayaran', 'penyesuaian'])
                        ? -abs($ledgerData['debit_amount'])
                        : 0,
                    'debit_unpaid'           => $ledgerData['debit_unpaid'] ?? 0,
                    'credit_amount'          => $entry['accounting_type'] === 'surat pemberitahuan'
                        ? abs($ledgerData['debit_amount'])
                        : 0,
                    'credit_left'            => $ledgerData['credit_left'] ?? 0,
                    'kap'                    => $ledgerData['kap'],
                    'kap_description'        => $ledgerData['kap_description'],
                    'kjs'                    => $ledgerData['kjs'],
                    'tax_period'             => $ledgerData['tax_period'],
                    'transaction_number'     => $ledgerData['transaction_number'],
                ]);
                $ledger->save();

                CourseResult::firstOrCreate([
                    'course_user_id' => $courseUser->id,
                    'billing_id'     => $billing->id,
                    'ledger_id'      => $ledger->id,
                    'spt_id'         => $spt->id,
                ]);
            }
        }
    }

    /**
     * Download BPE for SPT Badan
     */
    public function downloadBPEBadan($id)
    {
        $activeCourseId = session('active_course_id');
        $activeBusinessEntityId = session('active_business_entity_id');

        if (!$activeBusinessEntityId) {
            abort(403, 'Badan usaha aktif belum dipilih.');
        }

        $spt = Spt::with(['form', 'user'])
            ->when($activeCourseId, function ($q) use ($activeCourseId) {
                $q->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                    $q2->where('course_id', $activeCourseId);
                });
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHBADAN');
            })
            ->whereHas('sptBadan', function ($q) use ($activeBusinessEntityId) {
                $q->where('business_entity_id', $activeBusinessEntityId);
            })
            ->findOrFail($id);

        if (!$spt->ntte) {
            abort(404, 'BPE belum tersedia. SPT belum dilaporkan.');
        }

        $user      = $spt->user ?? Auth::user();
        $sptBadan  = SptBadan::where('spt_id', $spt->id)
            ->where('business_entity_id', $activeBusinessEntityId)
            ->firstOrFail();

        Carbon::setLocale('id');
        $formattedDate = Carbon::parse($spt->updated_at)->translatedFormat('d F Y');

        $pdf = Pdf::loadView('pdf/bpe_badan', compact('spt', 'user', 'sptBadan', 'formattedDate'));

        return $pdf->stream('BPE_PPh_Badan_' . $user->name . '_' . $spt->year . '.pdf');
    }

    /**
     * Download SPT Badan PDF
     */
    public function downloadSPTBadan($id)
    {
        $activeCourseId = session('active_course_id');
        $activeBusinessEntityId = session('active_business_entity_id');

        if (!$activeBusinessEntityId) {
            abort(403, 'Badan usaha aktif belum dipilih.');
        }

        $spt = Spt::with(['form', 'user'])
            ->when($activeCourseId, function ($q) use ($activeCourseId) {
                $q->whereHas('courseResults.courseUser', function ($q2) use ($activeCourseId) {
                    $q2->where('course_id', $activeCourseId);
                });
            })
            ->whereHas('form', function ($q) {
                $q->where('code', 'PPHBADAN');
            })
            ->whereHas('sptBadan', function ($q) use ($activeBusinessEntityId) {
                $q->where('business_entity_id', $activeBusinessEntityId);
            })
            ->findOrFail($id);

        $user     = $spt->user ?? Auth::user();
        $sptBadan = SptBadan::where('spt_id', $spt->id)
            ->where('business_entity_id', $activeBusinessEntityId)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf/spt_badan', compact('spt', 'user', 'sptBadan'));
        $pdf->setPaper('A4', 'portrait');

        return $pdf->stream('SPT_PPh_Badan_' . $user->name . '_' . $spt->year . '.pdf');
    }

    /**
     * Upload attachment file for SPT Badan (I. Lampiran Lainnya)
     */
    public function uploadAttachment(Request $request)
    {
        $activeBusinessEntityId = session('active_business_entity_id');

        $allowedFields = [
            'i_a_1',
            'i_a_2',
            'i_b',
            'i_c',
            'i_d',
            'i_e',
            'i_f',
            'i_f_1',
            'i_f_2',
            'i_f_3',
            'i_f_4',
            'i_g',
            'i_h_1',
            'i_h_2',
            'i_i',
            'i_j',
        ];

        $fileRules = [];
        foreach ($allowedFields as $f) {
            $fileRules[$f] = 'nullable|file|mimes:pdf|max:10240';
        }

        $request->validate(array_merge([
            'spt_badan_id' => 'required|string|exists:spt_badan,id',
            'field'        => 'nullable|string|in:' . implode(',', $allowedFields),
            'file'         => 'nullable|file|mimes:pdf|max:10240',
        ], $fileRules));

        $field        = $request->input('field');
        $uploadedFile = $request->file('file');

        if (!$field || !$uploadedFile) {
            foreach ($allowedFields as $candidate) {
                if ($request->hasFile($candidate)) {
                    $field        = $candidate;
                    $uploadedFile = $request->file($candidate);
                    break;
                }
            }
        }

        if (!$field || !$uploadedFile || !in_array($field, $allowedFields, true)) {
            return response()->json(['error' => 'File attachment tidak valid.'], 422);
        }

        $sptBadan = SptBadan::findOrFail($request->spt_badan_id);

        if ($activeBusinessEntityId && $sptBadan->business_entity_id !== $activeBusinessEntityId) {
            return response()->json(['error' => 'Akses ditolak.'], 403);
        }

        if ($sptBadan->{$field}) {
            Storage::disk('public')->delete($sptBadan->{$field});
        }

        $originalName = $uploadedFile->getClientOriginalName();
        $path         = $uploadedFile->store('spt-badan-attachments', 'public');

        $updates     = [$field => $path];
        $nameColumn  = $field . '_name';
        if (Schema::hasColumn('spt_badan', $nameColumn)) {
            $updates[$nameColumn] = $originalName;
        }

        $sptBadan->update($updates);

        return response()->json([
            'success'       => true,
            'field'         => $field,
            'path'          => $path,
            'original_name' => $originalName,
        ]);
    }

    /**
     * Delete attachment file for SPT Badan (I. Lampiran Lainnya)
     */
    public function deleteAttachment(Request $request)
    {
        $activeBusinessEntityId = session('active_business_entity_id');

        $allowedFields = [
            'i_a_1',
            'i_a_2',
            'i_b',
            'i_c',
            'i_d',
            'i_e',
            'i_f',
            'i_f_1',
            'i_f_2',
            'i_f_3',
            'i_f_4',
            'i_g',
            'i_h_1',
            'i_h_2',
            'i_i',
            'i_j',
        ];

        $request->validate([
            'spt_badan_id' => 'required|string|exists:spt_badan,id',
            'field'        => 'required|string|in:' . implode(',', $allowedFields),
        ]);

        $field    = $request->input('field');
        $sptBadan = SptBadan::findOrFail($request->spt_badan_id);

        if ($activeBusinessEntityId && $sptBadan->business_entity_id !== $activeBusinessEntityId) {
            return response()->json(['error' => 'Akses ditolak.'], 403);
        }

        if ($sptBadan->{$field}) {
            Storage::disk('public')->delete($sptBadan->{$field});
        }

        $updates    = [$field => null];
        $nameColumn = $field . '_name';
        if (Schema::hasColumn('spt_badan', $nameColumn)) {
            $updates[$nameColumn] = null;
        }

        $sptBadan->update($updates);

        return response()->json(['success' => true, 'field' => $field]);
    }
}
