<!DOCTYPE html>
<html>

<head>
    <title>Bukti Penerimaan Elektronik – SPT Tahunan PPh Badan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin: 20px;
        }

        .header {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .sub-header {
            text-align: center;
            font-size: 10px;
            margin-top: 5px;
        }

        .separator {
            border-top: 2px solid black;
            margin: 10px 0;
        }

        .box {
            border: 1px solid black;
            padding: 8px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
        }

        .info-table {
            width: 100%;
            font-size: 13px;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 5px 8px;
            vertical-align: top;
        }

        .label {
            width: 35%;
            font-weight: bold;
        }

        .value {
            width: 65%;
        }

        .footer-note {
            font-size: 10px;
            margin-top: 20px;
            border-top: 1px solid #999;
            padding-top: 8px;
            color: #555;
        }
    </style>
</head>

<body>

    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" alt="Brevet Learning System" style="width: 160px;">
    </div>

    <div class="sub-header">
        PERMATA PERMADANI RESIDENCE BLOK B1, PENDEM, JUNREJO, KOTA BATU, 65324 <br>
        TELEPON 081250031744; SITUS www.biinspirainstitute.com
    </div>

    <div class="separator"></div>

    <div class="box">
        BUKTI PENERIMAAN ELEKTRONIK <br>
        Nomor: <strong>{{ $spt->ntte }}</strong> <br>
        Tanggal: <strong>{{ $formattedDate }}</strong>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">NPWP</td>
            <td class="value">: {{ $sptBadan->businessEntity->npwp ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nama Wajib Pajak</td>
            <td class="value">: {{ $sptBadan->businessEntity->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Jenis SPT</td>
            <td class="value">: SPT Tahunan PPh Badan</td>
        </tr>
        <tr>
            <td class="label">Tahun Pajak</td>
            <td class="value">: {{ $spt->year }}</td>
        </tr>
        <tr>
            <td class="label">Masa Pajak</td>
            <td class="value">: {{ $spt->start_period }} s.d. {{ $spt->end_period }} {{ $spt->year }}</td>
        </tr>
        <tr>
            <td class="label">Pembetulan ke</td>
            <td class="value">: {{ $spt->correction_number === 0 ? '0 (Normal)' : $spt->correction_number }}</td>
        </tr>
        <tr>
            <td class="label">Status SPT</td>
            <td class="value">:
                @if(($sptBadan->f_17c ?? 0) == 0)
                    Nihil (0)
                @elseif(($sptBadan->f_17c ?? 0) < 0)
                    Lebih Bayar (Rp {{ number_format(abs($sptBadan->f_17c), 0, ',', '.') }})
                @else
                    Kurang Bayar (Rp {{ number_format($sptBadan->f_17c, 0, ',', '.') }})
                @endif
            </td>
        </tr>
        <tr>
            <td class="label">PPh Kurang/Lebih Bayar (F.17.c)</td>
            <td class="value">: Rp {{ number_format($sptBadan->f_17c ?? 0, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Penandatangan</td>
            <td class="value">: {{ $sptBadan->j_signer_name ?? $user->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Saluran</td>
            <td class="value">: Portal Wajib Pajak</td>
        </tr>
        <tr>
            <td class="label">Tanggal Terima SPT</td>
            <td class="value">: {{ $formattedDate }}</td>
        </tr>
    </table>

    <div class="footer-note">
        Dokumen ini merupakan Bukti Penerimaan Elektronik (BPE) yang diterbitkan secara sistem atas penyampaian
        SPT Tahunan PPh Badan. BPE ini sah tanpa tanda tangan basah.
    </div>

</body>

</html>
