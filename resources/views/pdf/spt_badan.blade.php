<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>SPT Tahunan PPh Badan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 20px;
            color: #000;
        }

        .header-wrap {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        .header-left {
            display: table-cell;
            width: 30%;
            text-align: center;
            vertical-align: middle;
            padding: 5px 8px;
        }

        .header-left-inner {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }

        .header-left img {
            width: 80px;
        }

        .header-center {
            display: table-cell;
            width: 40%;
            text-align: center;
            vertical-align: middle;
            padding: 5px;
        }

        .header-center .spt-title {
            font-size: 12px;
            font-weight: bold;
        }

        .header-center .spt-sub {
            font-size: 9px;
            font-weight: bold;
        }

        .header-center .spt-desc {
            font-size: 8.5px;
            font-weight: bold;
        }

        .header-right {
            display: table-cell;
            width: 30%;
            vertical-align: middle;
            text-align: center;
            background-color: #FFD700;
            padding: 4px;
        }

        .header-right .induk {
            font-size: 13px;
            font-weight: bold;
        }

        .header-right .halaman {
            font-size: 8.5px;
            font-weight: bold;
        }

        .info-row {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000;
            border-top: none;
            background: #c9c9c9f0;
            margin-bottom: 8px;
        }

        .info-row th {
            border: 1px solid #000;
            padding: 3px 4px;
            font-size: 7px;
            text-align: center;
            font-weight: bold;
        }

        .info-row td {
            border: 1px solid #000;
            padding: 4px 4px;
            font-size: 8.5px;
            text-align: center;
            vertical-align: middle;
            background: #ffffff;
        }

        .period-label {
            font-size: 7px;
            color: #555;
        }

        .check-line {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
            font-size: 9px;
        }

        .check-box {
            width: 16px;
            height: 16px;
            border: 1px solid #222;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            line-height: 1;
            background: #fff;
        }

        .digit-row {
            display: flex;
            gap: 0;
            margin-top: 4px;
        }

        .digit-box {
            width: 34px;
            height: 32px;
            border: 1px solid #222;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            background: #fff;
        }

        .year-box {
            width: 136px;
        }

        .period-grid {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 18px;
            margin-top: 4px;
        }

        .period-col {
            text-align: center;
            min-width: 84px;
        }

        .period-col .small-label {
            font-size: 7px;
            font-weight: bold;
            margin-bottom: 3px;
            text-transform: uppercase;
        }

        .period-sep {
            align-self: center;
            font-size: 10px;
            margin-top: 16px;
        }

        .section-title {
            margin-top: 14px;
            background: #1e3a6e;
            color: #fff;
            font-weight: bold;
            padding: 6px 8px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table td,
        .table th {
            border: 1px solid #cfcfcf;
            padding: 6px 8px;
            vertical-align: top;
        }

        .label {
            width: 36%;
            font-weight: bold;
            background: #f4f4f4;
        }

        .value {
            width: 64%;
        }

        .note {
            margin-top: 16px;
            font-size: 10px;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 8px;
        }

        .identity-table {
            width: 100%;
            border-collapse: collapse;
        }

        .identity-table td {
            border: 1px solid #cfcfcf;
            padding: 6px 8px;
            vertical-align: middle;
        }

        .id-no {
            width: 4%;
            text-align: center;
            font-weight: bold;
        }

        .id-label {
            width: 16%;
            font-weight: bold;
        }

        .id-value {
            width: 30%;
        }

        .val-box {
            border: 1px solid #aaa;
            background: #fff;
            padding: 1px 4px;
            height: 14px;
            line-height: 12px;
            text-align: left;
            display: inline-block;
            width: 96%;
            box-sizing: border-box;
        }

        .detail-layout {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }

        .detail-layout td {
            /* border: 0.5px solid #000; */
            padding: 2px 4px;
            vertical-align: top;
            /* background: #d7d7d7; */
            line-height: 1.25;
            font-size: 11px;
        }

        .detail-layout .section-head td {
            background: #1e3a6e;
            color: #fff;
            font-weight: bold;
            font-size: 11px;
            padding: 6px 8px;
        }

        .detail-layout .num-col {
            width: 26px;
            text-align: center;
            padding: 2px;
        }

        .detail-layout .sub-col {
            width: 20px;
            text-align: center;
            padding: 2px;
        }

        .detail-layout .text-col {
            width: auto;
        }

        .detail-layout .opt-col {
            width: 140px;
            white-space: nowrap;
        }

        .detail-layout .fill-col {
            width: 160px;
        }

        .num-box {
            display: inline-block;
            min-width: 14px;
            height: 12px;
            padding: 0 2px;
            /* border: 1px solid #000; */
            /* background: #f0c419; */
            font-weight: bold;
            font-size: 11px;
            line-height: 12px;
            box-sizing: border-box;
            text-align: center;
        }

        .tiny-box {
            display: inline-block;
            width: 8px;
            height: 8px;
            border: 1px solid #000;
            background: #fff;
            line-height: 8px;
            text-align: center;
            vertical-align: middle;
            margin-right: 3px;
            box-sizing: border-box;
        }

        .choice-wrap {
            white-space: nowrap;
            font-weight: bold;
        }

        .choice-gap {
            display: inline-block;
            width: 10px;
        }

        .line-box {
            display: inline-block;
            width: 100%;
            height: 14px;
            line-height: 10px;
            padding: 0 3px;
            border: 1px solid #000;
            background: #fff;
            box-sizing: border-box;
            overflow: hidden;
        }

        .line-box.sm {
            width: 120px;
        }

        .line-box.xs {
            width: 64px;
            text-align: right;
            padding-right: 4px;
            line-height: 12px;
            font-size: 11px;
        }

        .ref-note {
            color: #8e2ba8;
            font-size: 11px;
            text-decoration: underline;
            margin-top: 1px;
            display: inline-block;
        }

        .formula {
            text-align: right;
            white-space: nowrap;
        }

        .formula .num-box {
            margin: 0 2px;
        }

        .small-text {
            font-size: 11px;
        }

        .attach-box {
            display: inline-block;
            width: 64px;
            height: 14px;
            line-height: 12px;
            padding: 0 3px;
            border: 1px solid #000;
            background: #fff;
            box-sizing: border-box;
            overflow: hidden;
        }

        .indent-line {
            display: block;
            margin-left: 18px;
        }

        .declare-cell {
            background: #ffc000;
            font-weight: bold;
            font-size: 11px;
            line-height: 1.25;
            padding: 6px 8px;
        }

        .sign-wrap {
            display: table;
            width: 100%;
            margin-top: 6px;
            font-size: 11px;
        }

        .sign-left,
        .sign-right {
            display: table-cell;
            vertical-align: top;
        }

        .sign-left {
            width: 67%;
            padding-right: 10px;
        }

        .sign-right {
            width: 33%;
        }

        .sign-row {
            margin-bottom: 4px;
            white-space: nowrap;
        }

        .sign-label {
            display: inline-block;
            width: 170px;
        }

        .sign-input {
            display: inline-block;
            height: 14px;
            line-height: 12px;
            padding: 0 4px;
            border: 1px solid #000;
            background: #fff;
            box-sizing: border-box;
            vertical-align: middle;
            overflow: hidden;
        }

        .sign-input.nik {
            width: 390px;
        }

        .sign-input.full {
            width: 390px;
        }

        .sign-choice {
            font-weight: bold;
            margin-right: 10px;
        }

        .date-label {
            display: inline-block;
            width: 80px;
            font-weight: bold;
        }

        .date-box {
            display: inline-block;
            width: 68px;
            height: 14px;
            line-height: 12px;
            text-align: center;
            border: 1px solid #000;
            background: #fff;
            margin-right: 8px;
            vertical-align: middle;
            box-sizing: border-box;
        }

        .date-box.year {
            width: 95px;
            margin-right: 0;
        }

        .sign-panel {
            margin-top: 4px;
            height: 84px;
            border: 1px solid #000;
            background: #fff;
            position: relative;
            text-align: center;
            padding-top: 12px;
            box-sizing: border-box;
        }

        .sign-panel .caption {
            font-size: 7px;
            color: #888;
            margin-top: 2px;
        }
    </style>
</head>

<body>
    <div class="header-wrap">
        <div class="header-left">
            <div class="header-left-inner">
                <img src="{{ public_path('images/logo.png') }}" alt="Kemenkeu">
            </div>
        </div>
        <div class="header-center">
            <div class="spt-title">SPT TAHUNAN</div>
            <div class="spt-sub">PAJAK PENGHASILAN (PPh)</div>
            <div class="spt-desc">WAJIB PAJAK BADAN</div>
        </div>
        <div class="header-right">
            <div class="induk">INDUK</div>
            <div class="halaman">HALAMAN 1</div>
        </div>
    </div>

    @php
        $periodMap = ['Januari'=>1,'Februari'=>2,'Maret'=>3,'April'=>4,'Mei'=>5,'Juni'=>6,
                    'Juli'=>7,'Agustus'=>8,'September'=>9,'Oktober'=>10,'November'=>11,'Desember'=>12];
        $bulanMulai = $periodMap[$spt->start_period] ?? 1;
        $bulanAkhir = $periodMap[$spt->end_period]   ?? 12;
        $statusSpt  = ($spt->correction_number === 0) ? 'NORMAL' : 'PEMBETULAN';

        $bookkeepingType = strtolower((string) ($sptOp->type_of_bookkeeping ?? ''));
        $metodeLabel = match ($bookkeepingType) {
            'pembukuan stelsel akrual' => 'PEMBUKUAN STELSEL AKRUAL',
            'pembukuan stelsel kas' => 'PEMBUKUAN STELSEL KAS',
            default => 'PENCATATAN',
        };

        $fmtNum = fn($value) => number_format((float) ($value ?? 0), 0, ',', '.');
        $fmtText = fn($value, $default = '-') => filled((string) $value) ? $value : $default;
        $isChecked = fn($value) => !is_null($value) && (bool) $value;
        $isUnchecked = fn($value) => !is_null($value) && !(bool) $value;

        $tarifLabels = [
            'a' => 'a',
            'b' => 'b',
            'c' => 'c',
            'd' => 'd',
            'umum' => 'a',
            'fasilitas' => 'b',
            '31e' => 'c',
            'lainnya' => 'd',
        ];
        $tarifKey = strtolower((string) ($sptBadan->d_11 ?? ''));
        $tarifSelected = $tarifLabels[$tarifKey] ?? null;

        $refundOption = strtolower((string) ($sptBadan->f_19a ?? ''));
        $refundPemeriksaan = in_array($refundOption, ['1', 'pemeriksaan'], true);
        $refundPendahuluan = in_array($refundOption, ['2', 'pendahuluan', 'pengembalian pendahuluan'], true);

        $signerType = ($sptBadan->j_signer ?? 'taxpayer') === 'representative' ? 'representative' : 'taxpayer';
        $ttdDate = optional($spt->updated_at);
        $ttdDay = $ttdDate ? $ttdDate->format('d') : '';
        $ttdMonth = $ttdDate ? $ttdDate->format('m') : '';
        $ttdYear = $ttdDate ? $ttdDate->format('Y') : '';

        $hasUpload = function (...$values) {
            foreach ($values as $value) {
                if (filled(trim((string) $value))) {
                    return true;
                }
            }
            return false;
        };

        $iAUploaded = $hasUpload($sptBadan->i_a_1, $sptBadan->i_a_2);
        $iBUploaded = $hasUpload($sptBadan->i_b);
        $iCUploaded = $hasUpload($sptBadan->i_c);
        $iDUploaded = $hasUpload($sptBadan->i_d);
        $iEUploaded = $hasUpload($sptBadan->i_e);
        $iFUploaded = $hasUpload($sptBadan->i_f, $sptBadan->i_f_1, $sptBadan->i_f_2, $sptBadan->i_f_3, $sptBadan->i_f_4);
        $iGUploaded = $hasUpload($sptBadan->i_g);
        $iHUploaded = $hasUpload($sptBadan->i_h_1, $sptBadan->i_h_2);
        $iIUploaded = $hasUpload($sptBadan->i_i);
        $iJUploaded = $hasUpload($sptBadan->i_j);
    @endphp
    <table class="info-row">
        <tr>
            <th style="width:15%">TAHUN PAJAK/<br>BAGIAN TAHUN PAJAK</th>
            <th style="width:7%"></th>
            <th style="width:6%">PERIODE</th>
            <th style="width:7%"></th>
            <th style="width:15%">STATUS</th>
            <th style="width:25%">METODE PEMBUKUAN</th>
        </tr>
        <tr>
            <td style="font-size:12px; font-weight:bold;">{{ $spt->year }}</td>
            <td style="font-size:11px; font-weight:bold;">{{ $bulanMulai }}</td>
            <td style="font-size:8px; color:#666;">s.d</td>
            <td style="font-size:11px; font-weight:bold;">{{ $bulanAkhir }}</td>
            <td style="font-weight:bold;">{{ $statusSpt }}</td>
            <td>{{ $metodeLabel }}</td>
        </tr>
        <tr>
            <td></td>
            <td><div class="period-label">BULAN MULAI</div></td>
            <td></td>
            <td><div class="period-label">BULAN AKHIR</div></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <div class="section-title">A. IDENTITAS WAJIB PAJAK BADAN</div>
    <table class="main-table">
        <tr>
            <td style="width:4%; text-align:center;">1.</td>
            <td style="width:13%;">NPWP</td>
            <td style="width:30%;"><span class="val-box" style="text-align:left;">{{ $sptBadan->businessEntity->npwp ?? '-' }}</span></td>
        </tr>
        <tr>
            <td style="text-align:center;">2.</td>
            <td>Nama Wajib Pajak</td>
            <td><span class="val-box" style="text-align:left;">{{ $sptBadan->businessEntity->name ?? '-' }}</span></td>
            <td style="width:4%; text-align:center;"></td>
        </tr>
        <tr>
            <td style="text-align:center;">3.</td>
            <td>Alamat</td>
            <td><span class="val-box" style="text-align:left;">{{ $sptBadan->businessEntity->address ?? '-' }}</span></td>
            
        </tr>
        <tr>
            <td style="text-align:center;">4.</td>
            <td>Email</td>
            <td><span class="val-box" style="text-align:left;">{{ $user->email ?? '-' }}</span></td>
            <td style="width:4%; text-align:center;"></td>
        </tr>
        <tr>
            <td style="text-align:center;">5.</td>
            <td>No. Telepon</td>
            <td><span class="val-box" style="text-align:left;">{{ $user->phone_number ?? '-' }}</span></td>
            <td style="width:4%; text-align:center;"></td>
            <td colspan="2" style="font-size:8px; width:50%"></td>
        </tr>
    </table>

    <table class="detail-layout">
        <tr class="section-head">
            <td colspan="5">B. INFORMASI LAPORAN KEUANGAN</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">1</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Sektor Usaha Laporan Keuangan pada Lampiran 1</td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtText($sptBadan->b_1a, '') }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">2</span></td>
            <td class="sub-col"></td>
            <td class="text-col">
                Apakah Laporan Keuangan diaudit oleh Akuntan Publik?<br>
                <span class="small-text">Jika "Ya", isilah informasi mengenai Kantor Akuntan Publik di bawah ini:<br>
                    a. NPWP Kantor Akuntan Publik<br>
                    b. Nama Kantor Akuntan Publik</span>
            </td>
            <td class="opt-col">
                <span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->b_2) ? 'X' : '' }}</span>TIDAK</span>
                <span class="choice-gap"></span>
                <span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->b_2) ? 'X' : '' }}</span>YA</span>
                <span class="choice-gap"></span>
                <span class="choice-wrap">Opini Auditor</span>
            </td>
            <td class="fill-col">
                <span class="line-box">{{ $fmtText($sptBadan->b_2a, '') }}</span>
                <span class="line-box" style="margin-top:6px;">{{ $fmtText($sptBadan->b_2b, '') }}</span>
                <span class="line-box" style="margin-top:6px;">{{ $fmtText($sptBadan->b_2c, '') }}</span>
            </td>
        </tr>

        <tr class="section-head">
            <td colspan="5">C. PENGHASILAN YANG DIKENAKAN PPH YANG BERSIFAT FINAL DAN PENGHASILAN YANG TIDAK TERMASUK OBJEK PAJAK</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">1</span></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">Apakah Wajib Pajak menerima atau memperoleh penghasilan dari usaha dengan peredaran bruto tertentu yang dikenakan PPh yang bersifat final ? <br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->c_1a) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->c_1a) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">Apakah penghasilan Wajib Pajak semata-mata hanya penghasilan dari usaha dengan peredaran bruto tertentu yang dikenakan PPh yang bersifat final ? <br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->c_1b) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->c_1b) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">2</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah wajib Pajak menerima atau memperoleh penghasilan yang dikenakan PPh yang bersifat final ?</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->c_2) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->c_2) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->c_2_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">3</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah Wajib Pajak menerima atau memperoleh penghasilan yang tidak termasuk objek pajak ? <br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->c_3) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->c_3) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->c_3_value) }}</span></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">D. PENGHITUNGAN PPH</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">4</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Penghasilan Neto Fiskal sebelum Fasilitas Pajak<br><span class="small-text">Diisi dari Lampiran 1 (sesuai sektor usaha) Bagian A Kolom (10)</span></td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->d_4) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">5</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah Wajib Pajak memperoleh Fasilitas Perpajakan dalam rangka Penanaman Modal berupa pengurangan penghasilan neto ?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->d_5) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->d_5) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->d_5_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">6</span></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">Apakah Wajib Pajak memperoleh Fasilitas Pengurangan Penghasilan Bruto atas Kegiatan Praktik Kerja, Pemagangan, dan/atau Pembelajaran dalam rangka Pembinaan dan Pengembangan Sumber Daya Manusia Berbasis Kompetensi Tertentu?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->d_6) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->d_6) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->d_6_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">7</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Penghasilan Neto Fiskal Setelah Fasilitas Pajak</td>
            <td class="opt-col formula">(<span class="num-box">4</span> - <span class="num-box">5</span> - <span class="num-box">6</span>)</td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->d_7) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">8</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah terdapat kerugian fiskal yang dapat dikompensasikan? </td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->d_8) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->d_8) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->d_8_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">9</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Penghasilan Kena Pajak</td>
            <td class="opt-col formula"><span class="num-box">7</span> - <span class="num-box">8</span></td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->d_9) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">10</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah Wajib Pajak memperoleh Fasilitas Pengurangan Penghasilan Bruto untuk Kegiatan Penelitian dan Pengembangan Tertentu ?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->d_10) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->d_10) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->d_10_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">11</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Tarif Pajak: (pilih salah satu)<br>a. {{ $tarifSelected === 'a' ? '[X]' : '[ ]' }} Tarif Ketentuan Umum sebagaimana Pasal 17 ayat (1) huruf b UU PPh<br>b. {{ $tarifSelected === 'b' ? '[X]' : '[ ]' }} Tarif Fasilitas sebagaimana Pasal 17 ayat (2b) UU PPh<br>c. {{ $tarifSelected === 'c' ? '[X]' : '[ ]' }} Tarif Fasilitas sebagaimana Pasal 31E ayat (1) UU PPh<br>d. {{ $tarifSelected === 'd' ? '[X]' : '[ ]' }} Tarif Lainnya</td>
            <td class="opt-col small-text">Persentase tarif lainnya</td>
            <td class="fill-col"><span class="line-box sm">{{ $fmtNum($sptBadan->d_11_percentage) }}</span> %</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">12</span></td>
            <td class="sub-col"></td>
            <td class="text-col">PPh Terutang <span class="small-text"><br>Jika pada angka 11 memilih huruf c, PPh Terutang diisi berdasarkan Lampiran 8</span></td>
            <td class="opt-col formula">(<span class="num-box">11</span> x (<span class="num-box">9</span> - <span class="num-box">10</span>))</td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->d_12) }}</span></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">E. PENGURANG PPH TERUTANG</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">13</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah terdapat kredit pajak yang dibayarkan di luar negeri dan/atau dipotong/dipungut oleh pihak lain ?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->e_13) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->e_13) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->e_13_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">14</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Angsuran PPh Pasal 25</td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->e_14) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">15</span></td>
            <td class="sub-col"></td>
            <td class="text-col">STP PPh Pasal 25 (hanya pokok pajak)</td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->e_15) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">16</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Apakah Wajib Pajak memperoleh Fasilitas Pengurangan PPh Badan?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->e_16) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->e_16) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->e_16_value) }}</span></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">F. PPH KURANG/LEBIH BAYAR</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">17</span></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">PPh yang Kurang/Lebih Bayar</td>
            <td class="opt-col formula">(<span class="num-box">12</span> - <span class="num-box">13</span> - <span class="num-box">14</span> - <span class="num-box">15</span> - <span class="num-box">16</span>)</td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->f_17a) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">Apakah terdapat Surat Keputusan Persetujuan Pengangsuran atau Penundaan Pembayaran Pajak?<br>Jika "Ya", isilah jumlah pajak yang dapat diangsur/ditunda pembayarannya</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_17b) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_17b) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->f_17b_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">c</span></td>
            <td class="text-col">PPh yang masih harus dibayar atau lebih bayar</td>
            <td class="opt-col formula">(<span class="num-box">17a</span> - <span class="num-box">17b</span>)</td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->f_17c) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">18</span></td>
            <td class="sub-col"></td>
            <td class="text-col">Pembetulan (diisi apabila Status SPT adalah Pembetulan)</td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->f_18a_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">PPh yang Kurang/Lebih Bayar pada SPT yang dibetulkan</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_18a) ? 'X' : '' }}</span>Ganti SPT Sebelumnya</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->f_18a_value) }}</span></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">PPh yang Kurang/Lebih Bayar pada SPT karena pembetulan</td>
            <td class="opt-col formula">(<span class="num-box">17a</span> - <span class="num-box">18a</span>)</td>
            <td class="fill-col"><span class="line-box xs">{{ $fmtNum($sptBadan->f_18b) }}</span></td>
        </tr>

        <tr>
            <td class="num-col"><span class="num-box">19</span></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">
                Lebih Bayar pada Angka 17 atau 18b mohon untuk: (pilih salah satu)<br>
                <span class="choice-wrap"><span class="tiny-box">{{ $refundPemeriksaan ? 'X' : '' }}</span>dikembalikan melalui pemeriksaan</span><br>
                <span class="choice-wrap"><span class="tiny-box">{{ $refundPendahuluan ? 'X' : '' }}</span>dikembalikan melalui pengembalian pendahuluan</span>
            </td>
            <td class="opt-col"></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">
                Informasi Rekening<br>
                Nomor Rekening <span style="display:inline-block; width:170px;"></span><span class="line-box sm" style="width:200px;">{{ $fmtText($sptBadan->account_number, '') }}</span>
                <span style="display:inline-block; width:40px;"></span>
                Nama Bank <span style="display:inline-block; width:30px;"></span><span class="line-box sm" style="width:200px;">{{ $fmtText($sptBadan->bank_name, '') }}</span><br>
                Nama Pemilik Rekening <span class="line-box sm" style="width:260px;">{{ $fmtText($sptBadan->account_name, '') }}</span><br>
                <strong>Jika Informasi rekening salah, silahkan melakukan perubahan data pada menu Registrasi</strong>
            </td>
            <td class="opt-col"></td>
            <td class="fill-col"></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">G. PENGHITUNGAN ANGSURAN PPH PASAL 25 TAHUN BERJALAN</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">20</span></td>
            <td class="sub-col"></td>
            <td class="text-col">
                Apakah Wajib Pajak merupakan Wajib Pajak tertentu yang harus menyampaikan Laporan Penghitungan Angsuran PPh Pasal 25 ?<br>
            </td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->g_20) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->g_20) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->g_20_value) }}</span></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">H. PERNYATAAN TRANSAKSI</td>
        </tr>
        <tr>
            <td class="num-col"><span class="num-box">21</span></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">Apakah terdapat transaksi yang dipengaruhi hubungan istimewa atau transaksi dengan pihak yang merupakan penduduk tax haven country ?
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21a) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21a) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">Apakah Wajib Pajak berkewajiban menyampaikan Dokumen Penentuan Harga Transfer?
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21b) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21b) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">c</span></td>
            <td class="text-col">Apakah terdapat penanaman modal pada perusahaan afiliasi?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21c) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21c) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">d</span></td>
            <td class="text-col">Apakah Wajib Pajak memiliki utang dari pemilik modal atau perusahaan afiliasi, dan/atau piutang ke pemilik modal atau perusahaan afiliasi?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21d) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21d) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">e</span></td>
            <td class="text-col">Apakah Wajib Pajak membebankan biaya penyusutan dan/atau amortisasi fiskal?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21e) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21e) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">f</span></td>
            <td class="text-col">Apakah Wajib Pajak membebankan biaya promosi dan penjualan, penggantian atau imbalan dalam bentuk natura dan/atau kenikmatan, biaya entertainment, dan/atau piutang yang nyata-nyata tidak dapat ditagih?<br></td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21f) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21f) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">g</span></td>
            <td class="text-col">Apakah Wajib Pajak memperoleh fasilitas perpajakan dalam rangka penanaman modal di bidang-bidang usaha tertentu dan/atau daerah-daerah tertentu selain pengurangan penghasilan neto?</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21g) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21g) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">h</span></td>
            <td class="text-col">Apakah Wajib Pajak memiliki sisa lebih yang digunakan untuk pembangunan dan pengadaan sarana dan prasarana ?</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21h) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21h) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">i</span></td>
            <td class="text-col">Apakah Wajib Pajak menerima atau memperoleh penghasilan dividen dari luar negeri dan melaporkannya sebagai penghasilan yang tidak termasuk objek pajak ?</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ $isUnchecked($sptBadan->f_21i) ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $isChecked($sptBadan->f_21i) ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">j</span></td>
            <td class="text-col">Kelebihan PPh yang bersifat final atas penghasilan dari usaha dengan peredaran bruto tertentu yang dapat diajukan pengembalian pajak<br></td>
            <td class="opt-col"></td>
            <td class="fill-col"><span class="line-box">{{ $fmtNum($sptBadan->f_21j) }}</span></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">I. LAMPIRAN LAINNYA</td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">a</span></td>
            <td class="text-col">1. Laporan Keuangan/Laporan Keuangan yang Telah Diaudit<br>2. Laporan Keuangan Konsolidasi untuk Wajib Pajak Grup</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iAUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iAUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">b</span></td>
            <td class="text-col">Opini Audit</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iBUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iBUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">c</span></td>
            <td class="text-col">Laporan Keuangan Konsolidasi untuk Bentuk Usaha Tetap</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iCUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iCUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">d</span></td>
            <td class="text-col">Salinan Bukti Pembayaran atau Bukti Pemotongan sehubungan dengan Kredit Pajak Luar Negeri</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iDUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iDUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">e</span></td>
            <td class="text-col">Bukti Jenis Penanaman Kembali dan Realisasi Penanaman kembali untuk Bentuk Usaha Tetap</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iEUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iEUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">f</span></td>
            <td class="text-col">
                Surat Penghitungan Pengkreditan Pajak yang Telah Dibayar atau Dipotong/Dipungut atas Dividen yang Diterima dari Badan Usaha Luar Negeri (BULN) Non Bursa Terkendali Langsung, termasuk :<br>
                <span class="indent-line">1. Laporan Keuangan BULN Nonbursa Terkendali Langsung</span>
                <span class="indent-line">2. Salinan surat pemberitahuan tahunan PPh BULN Nonbursa Terkendali Langsung</span>
                <span class="indent-line">3. Perhitungan atau Rincian Laba Setelah Pajak dalam 5 (lima) Tahun Terakhir BULN Nonbursa Terkendali Langsung</span>
                <span class="indent-line">4. Bukti Pembayaran Pajak Penghasilan atau Bukti Pemotongan Pajak Penghasilan atas Dividen yang diterima dari BULN Nonbursa Terkendali Langsung</span>
            </td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iFUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iFUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">g</span></td>
            <td class="text-col">Bukti Pembayaran Zakat atau Sumbangan Keagamaan yang Sifatnya Wajib</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iGUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iGUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">h</span></td>
            <td class="text-col">Laporan Wajib Pajak Dalam Rangka Pemenuhan Persyaratan Penurunan Tarif PPh Bagi Wajib Pajak Badan Dalam Negeri yang Berbentuk Perseroan Terbuka<br>
                <span class="indent-line">1. Laporan Bulanan</span>
                <span class="indent-line">2. Laporan Kepemilikan Saham yang Memiliki Hubungan Istimewa</span>
            </td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iHUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iHUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">i</span></td>
            <td class="text-col">Tanda Terima Elektronik Penyampaian Laporan per Negara (Country-by-Country Report)</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iIUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iIUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>
        <tr>
            <td class="num-col"></td>
            <td class="sub-col"><span class="num-box">j</span></td>
            <td class="text-col">Dokumen Lainnya</td>
            <td class="opt-col"><span class="choice-wrap"><span class="tiny-box">{{ !$iJUploaded ? 'X' : '' }}</span>TIDAK</span> <span class="choice-gap"></span><span class="choice-wrap"><span class="tiny-box">{{ $iJUploaded ? 'X' : '' }}</span>YA</span></td>
            <td class="fill-col"></td>
        </tr>

        <tr class="section-head">
            <td colspan="5">J. PERNYATAAN</td>
        </tr>
        
        <tr>
            <td colspan="5" style="padding:8px 6px;">
                <div class="sign-wrap">
                    <div class="sign-left">
                        <div class="sign-row">
                            <span class="sign-label">PENANDA TANGAN SPT</span>
                            <span class="sign-choice"><span class="tiny-box">{{ $signerType === 'taxpayer' ? 'X' : '' }}</span> WAJIB PAJAK (WAKIL WAJIB PAJAK)</span>
                            <span class="sign-choice"><span class="tiny-box">{{ $signerType === 'representative' ? 'X' : '' }}</span> KUASA WAJIB PAJAK</span>
                        </div>
                        <div class="sign-row">
                            <span class="sign-label">NIK/NPWP</span>
                            <span class="sign-input nik">{{ $fmtText($sptBadan->j_signer_id, $sptBadan->businessEntity->npwp ?? '-') }}</span>
                        </div>
                        <div class="sign-row">
                            <span class="sign-label">NAMA LENGKAP</span>
                            <span class="sign-input full">{{ $fmtText($sptBadan->j_signer_name, $sptBadan->businessEntity->name ?? '-') }}</span>
                        </div>
                        <div class="sign-row">
                            <span class="sign-label">JABATAN</span>
                            <span class="sign-input full">{{ $fmtText($sptBadan->j_signer_position, '-') }}</span>
                        </div>
                    </div>
                    <div class="sign-right">
                        <div class="sign-panel">
                            <img src="{{ public_path('images/barcode.png') }}" alt="Brevet Learning System" style="width: 50px;">
                            <div class="caption">Ditandatangani<br>secara elektronik</div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    

    <div class="note">
        Dokumen ini dihasilkan secara elektronik melalui portal wajib pajak dan digunakan sebagai salinan cetak
        SPT Tahunan PPh Badan.
    </div>
</body>

</html>
