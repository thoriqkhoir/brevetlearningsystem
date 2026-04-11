<!DOCTYPE html>
<html>

<head>
    <title>Bukti Penerimaan Elektronik - PPh 21/26</title>
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
            padding: 5px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
        }

        .info-table {
            width: 100%;
            font-size: 14px;
        }

        .info-table td {
            padding: 5px;
        }

        .label {
            width: 30%;
            font-weight: bold;
        }

        .value {
            width: 70%;
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
            <td class="value">: {{ $user->npwp }}</td>
        </tr>
        <tr>
            <td class="label">Nama Wajib Pajak</td>
            <td class="value">: {{ $user->name }}</td>
        </tr>
        <tr>
            <td class="label">Jenis SPT</td>
            <td class="value">: {{ $spt->form->name }}</td>
        </tr>
        <tr>
            <td class="label">Tahun Pajak</td>
            <td class="value">: {{ $spt->year }}</td>
        </tr>
        <tr>
            <td class="label">Masa Pajak</td>
            <td class="value">: {{ $spt->start_period }} {{ $spt->year }}</td>
        </tr>
        <tr>
            <td class="label">Pembetulan ke</td>
            <td class="value">: {{ $spt->correction_number === 0 ? '0' : $spt->correction_number }}</td>
        </tr>
        <tr>
            <td class="label">Status SPT</td>
            <td class="value">:
                @php
                    $total = $spt->tax_value;
                @endphp
                {{ $total == 0 ? 'Nihil (0)' : ($total < 0 ? 'Lebih Bayar (' . number_format(abs($total), 0, ',', '.') . ')' : 'Kurang Bayar (' . number_format($total, 0, ',', '.') . ')') }}
            </td>
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

</body>

</html>
