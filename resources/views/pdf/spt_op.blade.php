<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SPT Tahunan PPh Orang Pribadi</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            font-size: 8.5px;
            color: #000;
            padding: 10px 12px;
        }

        /* ===== HEADER ===== */
        .header-wrap { display: table; width: 100%; border: 1.5px solid #000; margin-bottom: 4px; }
        .header-left {
            display: table-cell; width: 30%; text-align: center; vertical-align: middle;
            padding: 5px 8px; border-right: 1.5px solid #000;
        }
        .header-left-inner {
            display: flex; flex-direction: row; align-items: center; gap: 8px;
        }
        .header-left img { width: 80px; }
        .header-left .kemenkeu { font-size: 7px; font-weight: bold; line-height: 1.4; margin-top: 3px; }
        .header-center {
            display: table-cell; width: 40%; text-align: center;
            vertical-align: middle; padding: 5px; border-right: 1.5px solid #000;
        }
        .header-center .spt-title { font-size: 12px; font-weight: bold; }
        .header-center .spt-sub  { font-size: 9px; font-weight: bold; }
        .header-center .spt-desc { font-size: 8.5px; font-weight: bold; }
        .header-right {
            display: table-cell; width: 30%; vertical-align: middle;
            text-align: center; background-color: #FFD700; padding: 4px;
        }
        .header-right .induk   { font-size: 13px; font-weight: bold; }
        .header-right .halaman { font-size: 8.5px; font-weight: bold; }

        /* ===== INFO ROW ===== */
        .info-row { width: 100%; border-collapse: collapse; border: 1.5px solid #000; border-top: none; background: #c9c9c9f0 }
        .info-row th { border: 1px solid #000; padding: 3px 4px; font-size: 7px; text-align: center; font-weight: bold;  }
        .info-row td { border: 1px solid #000; padding: 4px 4px; font-size: 8.5px; text-align: center; vertical-align: middle; background: #ffffff; }
        .period-label { font-size: 7px; color: #555; }

        /* ===== SECTIONS ===== */
        .section-hdr { background-color: #1e3a6e; color: #fff; font-weight: bold; font-size: 8.5px; padding: 3px 6px; }

        /* ===== MAIN TABLE ===== */
        .main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; margin-bottom: 0; }
        .main-table td { border: 0.5px solid #aaa; padding: 2.5px 5px; vertical-align: middle; }
        .main-table tr:nth-child(odd)  td { background-color: #f5f5f5; }
        .main-table tr:nth-child(even) td { background-color: #ebebeb; }

        .col-no  { width: 5%;  text-align: center; }
        .col-lbl { width: 5%;  text-align: center; }
        .col-desc{ width: 62%; }
        .col-ans { width: 7%;  text-align: center; }
        .col-val { width: 21%; text-align: right; }

        .row-bold td { font-weight: bold; }
        .val-box {
            border: 1px solid #aaa; background: #fff; padding: 1px 4px;
            text-align: right; display: inline-block; width: 90%;
        }
        .ans-box {
            border: 1px solid #aaa; background: #fff; padding: 1px 3px;
            text-align: center; display: inline-block; width: 26px;
        }
        .yellow-cell td { background-color: #ffffff !important; }
        .sub-desc { font-size: 7.5px; color: #444; line-height: 1.3; margin-top: 1px; }
        .indent2  { padding-left: 20px !important; }
        .right  { text-align: right; }
        .center { text-align: center; }
        .bold   { font-weight: bold; }
        .small  { font-size: 7.5px; }
        .mt2    { margin-top: 2px; }

        /* ===== PAGE 2 HEADER ===== */
        .page2-hdr { width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 0; }
        .page2-hdr td { border: 1px solid #000; padding: 3px 6px; font-size: 8px; vertical-align: middle; background: #1e3a6e; color: #fff; }

        /* ===== K. PERNYATAAN ===== */
        .pernyataan-box {
            background-color: #fff9c4; border: 1px solid #000;
            padding: 5px 8px; font-size: 8px; line-height: 1.4;
        }
        .ttd-table { width: 100%; border-collapse: collapse; margin-top: 2px; }
        .ttd-table td { border: 1px solid #aaa; padding: 3px 6px; font-size: 8px; vertical-align: middle; }
        .qr-placeholder {
            width: 48px; height: 48px; border: 1px solid #aaa; display: inline-block;
            text-align: center; font-size: 6px; padding-top: 17px; color: #999;
        }

        .page-break   { page-break-after: always; }
        .footer-note  { font-size: 7px; color: #444; margin-top: 6px; line-height: 1.4; }
        .container { width: 100%; }

    </style>
</head>

<body>

{{-- ======================== HALAMAN 1 ======================== --}}

{{-- Header --}}
<div class="header-wrap">
    <div class="header-left">
        <div class="header-left-inner">
        <img src="{{ public_path('images/logo.png') }}" alt="Kemenkeu">
        </div>
    </div>
    <div class="header-center">
        <div class="spt-title">SPT TAHUNAN</div>
        <div class="spt-sub">PAJAK PENGHASILAN (PPh)</div>
        <div class="spt-desc">WAJIB PAJAK ORANG PRIBADI</div>
    </div>
    <div class="header-right">
        <div class="induk">INDUK</div>
        <div class="halaman">HALAMAN 1</div>
    </div>
</div>

{{-- Info Row --}}
@php
    $periodMap = ['Januari'=>1,'Februari'=>2,'Maret'=>3,'April'=>4,'Mei'=>5,'Juni'=>6,
                  'Juli'=>7,'Agustus'=>8,'September'=>9,'Oktober'=>10,'November'=>11,'Desember'=>12];
    $bulanMulai = $periodMap[$spt->start_period] ?? 1;
    $bulanAkhir = $periodMap[$spt->end_period]   ?? 12;
    $statusSpt  = ($spt->correction_number === 0) ? 'NORMAL' : 'PEMBETULAN';
    $sumberMap  = [
        'pekerjaan'       => 'Pekerjaan',
        'pekerjaan bebas' => 'Pekerjaan Bebas',
        'kegiatan usaha'  => 'Kegiatan Usaha',
        'lainnya'         => 'Lainnya',
    ];
    $sumberLabel = $sumberMap[$sptOp->source_income ?? 'lainnya'] ?? 'Lainnya';
    $metodeMap   = [
        'pembukuan stelsel akrual' => 'Pembukuan',
        'pembukuan stelsel kas'    => 'Pembukuan',
        'pencatatan'               => 'Pencatatan',
    ];
    $metodeLabel = $metodeMap[$sptOp->type_of_bookkeeping ?? 'pencatatan'] ?? 'Pencatatan';
@endphp
<table class="info-row">
    <tr>
        <th style="width:15%">TAHUN PAJAK/<br>BAGIAN TAHUN PAJAK</th>
        <th style="width:7%"></th>
        <th style="width:6%">PERIODE</th>
        <th style="width:7%"></th>
        <th style="width:15%">STATUS</th>
        <th style="width:25%">SUMBER PENGHASILAN</th>
        <th style="width:25%">METODE PEMBUKUAN</th>
    </tr>
    <tr>
        <td style="font-size:12px; font-weight:bold;">{{ $spt->year }}</td>
        <td style="font-size:11px; font-weight:bold;">{{ $bulanMulai }}</td>
        <td style="font-size:8px; color:#666;">s.d</td>
        <td style="font-size:11px; font-weight:bold;">{{ $bulanAkhir }}</td>
        <td style="font-weight:bold;">{{ $statusSpt }}</td>
        <td>{{ $sumberLabel }}</td>
        <td>{{ $metodeLabel }}</td>
    </tr>
    <tr>
        <td></td>
        <td><div class="period-label">BULAN MULAI</div></td>
        <td></td>
        <td><div class="period-label">BULAN AKHIR</div></td>
        <td></td><td></td><td></td>
    </tr>
</table>

{{-- A. IDENTITAS WAJIB PAJAK --}}
<div class="section-hdr mt2">A. IDENTITAS WAJIB PAJAK</div>
<table class="main-table">
    <tr>
        <td style="width:4%; text-align:center;">1.</td>
        <td style="width:13%;">NIK/NPWP</td>
        <td style="width:30%;"><span class="val-box" style="text-align:left;">{{ $user->npwp ?? '-' }}</span></td>
        <td style="width:4%; text-align:center;">7.</td>
        <td colspan="2" style="font-size:8px; width:50%">Status Kewajiban Perpajakan Suami dan Istri</td>
    </tr>
    <tr>
        <td style="text-align:center;">2.</td>
        <td>Nama</td>
        <td><span class="val-box" style="text-align:left;">{{ $user->name }}</span></td>
        <td style="width:4%; text-align:center; ;"></td>
        <td colspan="2" style="font-size:8px; ; width:50%"><span class="val-box" style="text-align:left;">-</span></td>
        
    </tr>
    <tr>
        <td style="text-align:center;">3.</td>
        <td>Jenis ID</td>
        <td><span class="val-box" style="text-align:left;">KTP</span></td>
        <td style="width:4%; text-align:center; ;">8.</td>
        <td colspan="2" style="font-size:8px; ; width:50%">NIK/NPWP Suami/Istri</td>
    </tr>
    <tr>
        <td style="text-align:center;">4.</td>
        <td>No. ID</td>
        <td><span class="val-box" style="text-align:left;">{{ $user->npwp ?? '-' }}</span></td>
        <td style="width:4%; text-align:center; ;"></td>
        <td colspan="2" style="font-size:8px; ; width:50%"><span class="val-box" style="text-align:left;">-</span></td>
    </tr>
    <tr>
        <td style="text-align:center;">5.</td>
        <td>No. Telepon</td>
        <td><span class="val-box" style="text-align:left;">{{ $user->phone_number ?? '-' }}</span></td>
        <td style="width:4%; text-align:center; font-weight:bold;"></td>
        <td colspan="2" style="font-size:8px; font-weight:bold; width:50%"></td>
    </tr>
    <tr>
        <td style="text-align:center;">6.</td>
        <td>Email</td>
        <td><span class="val-box" style="text-align:left;">{{ $user->email ?? '-' }}</span></td>
        <td style="width:4%; text-align:center; font-weight:bold;"></td>
        <td colspan="2" style="font-size:8px; font-weight:bold; width:50%"></td>
    </tr>
</table>

{{-- Helper function --}}
@php
    function yesno($val) {
        if ($val === true || $val == 1)  return 2;
        return 1;
    }
@endphp

{{-- B. IKHTISAR PENGHASILAN NETO --}}
<div class="section-hdr mt2">B. IKHTISAR PENGHASILAN NETO</div>
<table class="main-table">
    {{-- 1a --}}
    <tr class="yellow-cell">
        <td class="col-no bold">1</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima penghasilan dalam negeri dari pekerjaan?</strong>
            <div class="sub-desc">1. Tidak. (Lanjut ke pertanyaan selanjutnya)&nbsp;&nbsp;2. Ya. (Isi Lampiran 1 Bagian D)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->b_1a) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->b_1a_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    {{-- 1b header --}}
    <tr>
        <td class="col-no"></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">
            <strong>1) Apakah Anda menerima penghasilan dalam negeri dari usaha dan/atau pekerjaan bebas?</strong>
            <div class="sub-desc">1. Tidak. (Lanjut ke pertanyaan selanjutnya)&nbsp;&nbsp;2. Ya. (Lanjut ke pertanyaan 1c)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->b_1b_1) }}</span></td>
        <td class="col-val"><span></span></td>
    </tr>
    {{-- 1b.2 --}}
    <tr>
        <td></td><td></td>
        <td class="col-desc indent2">
            <strong>2) Apakah Anda termasuk Wajib Pajak Orang Pribadi yang memiliki peredaran bruto tertentu atau Orang Pribadi Pengusaha Tertentu (OPPT)?</strong>
            <div class="sub-desc">
                1. Tidak. &nbsp; 2. Ya, termasuk WP OPPT peredaran bruto tertentu yang dikenai pajak bersifat final. &nbsp; 3. Ya, termasuk WP OPPT.
            </div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->b_1b_2 === 'tidak' ? 1 : ($sptOp->b_1b_2 === 'ya1' ? 2 : 3) }}</span></td>
        <td class="col-val"></td>
    </tr>
    {{-- 1b.3 --}}
    <tr>
        <td></td><td></td>
        <td class="col-desc indent2">
            <strong>3) Apakah Anda menggunakan Norma dalam menghitung penghasilan neto?</strong>
            <div class="sub-desc">
                1. Tidak, menyelenggarakan pembukuan. &nbsp; 2. Tidak, hanya menerima penghasilan dari usaha final. &nbsp; 3. Ya, menggunakan Norma.
            </div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->b_1b_3 === 'tidak1' ? 1 : ($sptOp->b_1b_3 === 'tidak2' ? 2 : 3) }}</span></td>
        <td class="col-val"></td>
    </tr>
    {{-- 1b.4 --}}
    <tr>
        <td></td><td></td>
        <td class="col-desc indent2">
            <strong>4) Sebutkan sektor usaha yang Anda lakukan?</strong>
            <div class="sub-desc">1. Dagang &nbsp; 2. Jasa &nbsp; 3. Industri</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->b_1b_4 === 'dagang' ? 1 : ($sptOp->b_1b_4 === 'jasa' ? 2 : 3) }}</span></td>
        <td class="col-val"></td>
    </tr>
    {{-- 1b.5 --}}
    <tr>
        <td></td><td></td>
        <td class="col-desc indent2"><strong>5) Penghasilan neto dari usaha dan/atau pekerjaan bebas</strong></td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->b_1b_5 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    {{-- 1c --}}
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima penghasilan dalam negeri lainnya?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 1 Bagian C)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->b_1c) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->b_1c_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    {{-- 1d --}}
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">d</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima penghasilan luar negeri?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 2 Bagian C)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->b_1d) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->b_1d_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- C. PERHITUNGAN PPh TERUTANG --}}
<div class="section-hdr mt2">C. PERHITUNGAN PPh TERUTANG</div>
<table class="main-table">
    <tr class="row-bold">
        <td class="col-no">2</td>
        <td class="col-lbl"></td>
        <td class="col-desc">Penghasilan neto setahun (1a+1b+1c+1d)</td>
        <td class="col-ans"></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_2 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td class="col-no bold">3</td>
        <td class="col-lbl"></td>
        <td class="col-desc">
            <strong>Apakah terdapat pengurangan penghasilan neto seperti kompensasi kerugian atau zakat/sumbangan keagamaan yang bersifat wajib?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 5 Bagian A dan/atau Bagian B)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->c_3) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_3_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td class="col-no">4</td>
        <td class="col-lbl"></td>
        <td class="col-desc">Penghasilan neto setelah pengurang penghasilan neto (2-3)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_4 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td class="col-no">5</td>
        <td class="col-lbl"></td>
        <td class="col-desc">
            Penghasilan tidak kena pajak
            @if($sptOp->c_5)
                &nbsp;<span style="border:1px solid #aaa; padding:1px 5px; background:#fff; font-size:8px;">{{ $sptOp->c_5 }}</span>
            @endif
        </td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_6 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td class="col-no">6</td>
        <td class="col-lbl"></td>
        <td class="col-desc">Penghasilan kena pajak (4-5)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_6 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td class="col-no">7</td>
        <td class="col-lbl"></td>
        <td class="col-desc">PPh terutang</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_7 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td class="col-no bold">8</td>
        <td class="col-lbl"></td>
        <td class="col-desc">
            <strong>Apakah terdapat pengurang PPh terutang?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 5 Bagian C)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->c_8) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_8_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td class="col-no">9</td>
        <td class="col-lbl"></td>
        <td class="col-desc">PPh terutang setelah pengurang PPh terutang (7-8)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->c_9 ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- D. KREDIT PAJAK --}}
<div class="section-hdr mt2">D. KREDIT PAJAK</div>
<table class="main-table">
    <tr class="yellow-cell">
        <td class="col-no bold">10</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">
            <strong>Apakah terdapat PPh yang telah dipotong/dipungut oleh pihak lain?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 1 Bagian E)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->d_10_a) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->d_10_a_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">Angsuran PPh Pasal 25</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->d_10_b ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">STP PPh Pasal 25 (hanya pokok pajak)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->d_10_c ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">d</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima pengembalian/pengurangan kredit PPh luar negeri yang telah dikreditkan?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya.</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->d_10_d) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->d_10_d_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- PAGE BREAK --}}
<div class="page-break"></div>

{{-- ======================== HALAMAN 2 ======================== --}}

<div class="header-wrap">
    <div class="header-left">
        <div class="header-left-inner">
        <img src="{{ public_path('images/logo.png') }}" alt="Kemenkeu">
        </div>
    </div>
    <div class="header-center">
        <div class="spt-title">SPT TAHUNAN</div>
        <div class="spt-sub">PAJAK PENGHASILAN (PPh)</div>
        <div class="spt-desc">WAJIB PAJAK ORANG PRIBADI</div>
    </div>
    <div class="header-right">
        <div class="induk">INDUK</div>
        <div class="halaman">HALAMAN 2</div>
    </div>
</div>

{{-- Page 2 Header --}}
<table class="page2-hdr">
    <tr>
        <td style="width:12%; font-weight:bold; font-size:7.5px;">NIK/NPWP</td>
        <td style="width:33%;">{{ $user->npwp ?? '-' }}</td>
        <td style="width:28%; font-weight:bold; font-size:7.5px;">TAHUN PAJAK/BAGIAN TAHUN PAJAK</td>
        <td style="width:12%; text-align:center; font-size:11px; font-weight:bold;">{{ $spt->year }}</td>
    </tr>
</table>

{{-- E. PPh KURANG/LEBIH BAYAR --}}
<div class="section-hdr mt2">E. PPh KURANG/LEBIH BAYAR</div>
<table class="main-table">
    <tr>
        <td class="col-no bold">11</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">PPh kurang/lebih bayar (9-10a-10b-10c+10d)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->e_11_a ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">
            <strong>Apakah terdapat Surat Keputusan Persetujuan Pengangsuran atau Penundaan Pembayaran Pajak?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi dengan jumlah yang telah disetujui untuk diangsur/ditunda)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->e_11_b) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->e_11_b_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="row-bold">
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">PPh yang masih harus dibayar (11a-11b)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->e_11_c ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- F. PEMBETULAN --}}
<div class="section-hdr mt2">F. PEMBETULAN (DIISI JIKA STATUS SPT ADALAH PEMBETULAN)</div>
<table class="main-table">
    <tr>
        <td colspan="5" style="padding:3px 6px; font-size:8px;">
            Ganti SPT Sebelumnya &nbsp;
            <span style="border:1px solid #aaa; display:inline-block; width:14px; height:11px; text-align:center; background:#fff;">{{ $spt->correction_number > 0 ? '✓' : '' }}</span>
        </td>
    </tr>
    <tr>
        <td class="col-no bold">12</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">PPh kurang/lebih bayar pada SPT yang dibetulkan</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->f_12_a ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">PPh kurang/lebih bayar karena pembetulan (11a-12a)</td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->f_12_b ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- G. PERMOHONAN PENGEMBALIAN --}}
<div class="section-hdr mt2">G. PERMOHONAN PENGEMBALIAN PPh LEBIH BAYAR</div>
<table class="main-table">
    <tr>
        <td colspan="5" style="padding:4px 6px; font-size:8px; line-height:1.6; ">
            PPh lebih bayar pada 11a atau 12b mohon:
            &nbsp; 1. Dikembalikan melalui pemeriksaan. &nbsp; 2. Dikembalikan melalui permohonan pengembalian pendahuluan.<br>
            Nomor rekening: <span style="border:1px solid #aaa; padding:1px 4px; background:#fff; min-width:80px; display:inline-block; margin:6px 0 0 0">{{ $sptOp->account_number ?? '' }}</span>
            &nbsp;&nbsp;
            Nama bank: <span style="border:1px solid #aaa; padding:1px 4px; background:#fff; min-width:60px; display:inline-block;">{{ $sptOp->bank_name ?? '' }}</span>
            &nbsp;&nbsp;
            Nama pemilik rekening: <span style="border:1px solid #aaa; padding:1px 4px; background:#fff; min-width:80px; display:inline-block;">{{ $sptOp->account_name ?? '' }}</span>
        </td>
    </tr>
</table>

{{-- H. ANGSURAN PPH 25 --}}
<div class="section-hdr mt2">H. ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA</div>
<table class="main-table">
    <tr class="yellow-cell">
        <td class="col-no bold">13</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">
            <strong>Apakah Anda hanya menerima penghasilan teratur dan berkewajiban membayar angsuran PPh Pasal 25 sendiri?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya, angsuran PPh Pasal 25-nya adalah 1/12 × (9-10a)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->h_13_a) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->h_13_a_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">
            <strong>Apakah Anda menyusun tersendiri angsuran PPh Pasal 25 Tahun Pajak berikutnya?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 4 Bagian A)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->h_13_b) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->h_13_b_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">
            <strong>Apakah Anda membayar angsuran PPh Pasal 25 OPPT Tahun Pajak berikutnya?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya, angsuran sebesar 0,75% dari penghasilan bruto setiap bulan per tempat usaha.</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->h_13_c) }}</span></td>
        <td class="col-val"></td>
    </tr>
</table>

{{-- I. PERNYATAAN TRANSAKSI LAINNYA --}}
<div class="section-hdr mt2">I. PERNYATAAN TRANSAKSI LAINNYA</div>
<table class="main-table">
    <tr class="row-bold">
        <td class="col-no">14</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">Harta pada akhir Tahun Pajak &nbsp;<span class="small">(Isi Lampiran 1 Bagian A)</span></td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_a ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">
            <strong>Apakah Anda memiliki utang pada akhir tahun pajak?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 1 Bagian B)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_b) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_b_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima penghasilan yang dikenakan pajak penghasilan bersifat final?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 2 Bagian A)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_c) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_c_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">d</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima penghasilan yang tidak termasuk objek pajak?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 2 Bagian B)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_d) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_d_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">e</td>
        <td class="col-desc">
            <strong>Apakah Anda melaporkan biaya penyusutan dan/atau amortisasi fiskal?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 3C)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_e) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_e_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">f</td>
        <td class="col-desc">
            <strong>Apakah Anda melaporkan biaya <em>entertainment</em>, biaya promosi, penggantian atau imbalan dalam bentuk natura/kenikmatan, serta piutang yang nyata-nyata tidak dapat ditagih?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Isi Lampiran 3C)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_f) }}</span></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_f_value ?? 0, 0, ',', '.') }}</span></td>
    </tr>
    <tr class="yellow-cell">
        <td></td>
        <td class="col-lbl bold">g</td>
        <td class="col-desc">
            <strong>Apakah Anda menerima dividen dan/atau penghasilan lain dari luar negeri dan melaporkannya sebagai penghasilan tidak termasuk objek pajak?</strong>
            <div class="sub-desc">1. Tidak. &nbsp; 2. Ya. (Pastikan sudah menyampaikan laporan realisasi investasi secara terpisah)</div>
        </td>
        <td class="col-ans"><span class="ans-box">{{ yesno($sptOp->i_14_g) }}</span></td>
        <td class="col-val"></td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">h</td>
        <td class="col-desc">
            Kelebihan PPh Final atas penghasilan dari usaha dengan peredaran bruto tertentu yang dimintakan pengembalian.
        </td>
        <td></td>
        <td class="col-val"><span class="val-box">{{ number_format($sptOp->i_14_h ?? 0, 0, ',', '.') }}</span></td>
    </tr>
</table>

{{-- J. LAMPIRAN TAMBAHAN --}}
<div class="section-hdr mt2">J. LAMPIRAN TAMBAHAN</div>
<table class="main-table">
    <tr>
        <td class="col-no bold">15</td>
        <td class="col-lbl bold">a</td>
        <td class="col-desc">Laporan keuangan/laporan keuangan yang telah diaudit</td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->j_a ? '2' : '1' }}</span></td>
        <td class="col-val" style="font-size:8px;">1. Tidak &nbsp;&nbsp; 2. Ya</td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">b</td>
        <td class="col-desc">Bukti pembayaran zakat/sumbangan keagamaan</td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->j_b ? '2' : '1' }}</span></td>
        <td class="col-val" style="font-size:8px;">1. Tidak &nbsp;&nbsp; 2. Ya</td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">c</td>
        <td class="col-desc">Bukti pemotongan/pemungutan sehubungan dengan kredit pajak luar negeri</td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->j_c ? '2' : '1' }}</span></td>
        <td class="col-val" style="font-size:8px;">1. Tidak &nbsp;&nbsp; 2. Ya</td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">d</td>
        <td class="col-desc">Surat kuasa khusus</td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->j_d ? '2' : '1' }}</span></td>
        <td class="col-val" style="font-size:8px;">1. Tidak &nbsp;&nbsp; 2. Ya</td>
    </tr>
    <tr>
        <td></td>
        <td class="col-lbl bold">e</td>
        <td class="col-desc">Dokumen lainnya</td>
        <td class="col-ans"><span class="ans-box">{{ $sptOp->j_e ? '2' : '1' }}</span></td>
        <td class="col-val" style="font-size:8px;">1. Tidak &nbsp;&nbsp; 2. Ya</td>
    </tr>
</table>

{{-- K. PERNYATAAN --}}
<div class="section-hdr mt2" style="background-color:#1e3a6e; color:#fff;">K. PERNYATAAN</div>
<div class="pernyataan-box">
    Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan ketentuan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang telah saya beritahukan di atas beserta lampirannya adalah benar, lengkap, dan jelas.
</div>
@php
    $signerType = ($sptOp->k_signer === 'representative') ? 2 : 1;
    $signerName = $sptOp->k_signer_name ?? $user->name;
    $tanggalTtd = \Carbon\Carbon::parse($spt->updated_at)->locale('id')->isoFormat('D MMMM YYYY');
@endphp
<table class="ttd-table">
    <tr>
        <td style="width:50% font-weight:bold;">
            Penandatangan &nbsp;
            <span class="ans-box" style="margin-top:2px;">{{ $signerType }}</span>
            &nbsp; 1. Wajib Pajak &nbsp;&nbsp; 2. Kuasa
        </td>
        <td style="width:20%; font-weight:bold;">Tanggal</td>
        <td style="width:30%; text-align:left;">{{ $tanggalTtd }}</td>
    </tr>
    <tr>
        <td>NIK/NPWP &nbsp;&nbsp; {{ $sptOp->k_signer_id ?? ($user->npwp ?? '-') }}</td>
        <td style="font-weight:bold;">Tanda Tangan</td>
        <td rowspan="2" style="text-align:center; vertical-align:middle;">
            <img src="{{ public_path('images/barcode.png') }}" alt="Brevet Learning System" style="width: 50px; ">
            <div style="font-size:7px; color:#888; margin-top:2px;">Ditandatangani<br>secara elektronik</div>
        </td>
    </tr>
    <tr>
        <td>Nama &nbsp;&nbsp; {{ $signerName }}</td>
        <td></td>
    </tr>
</table>

<div class="footer-note">
    Dokumen ini telah dibubuhkan sertifikat elektronik yang diterbitkan oleh Balai Sertifikat Elektronik (BSrE)-BSSN dan/atau PSrE. Untuk memastikan keabsahan sertifikat elektronik, silahkan pindai QR Code atau unggah dokumen pada laman https://tia.kominfo.go.id/verif/PDF
</div>

</body>
</html>
