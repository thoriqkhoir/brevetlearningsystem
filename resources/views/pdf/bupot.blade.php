<!DOCTYPE html>
<html>

<head>
    <title>eBupot BPPU</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
        }

        .container {
            margin: auto;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
        }

        .title {
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;

        }

        .yellow-box {
            background-color: #FFD700;
            text-align: center;
            font-weight: bold;
            padding: 10px;
            font-size: 14px;

        }

        .info-pajak {
            width: 100%;
            border-collapse: collapse;
            background-color: #d9d9d9;
            text-align: center;
            margin-bottom: 10px;
            table-layout: fixed;
        }

        .info-pajak td,
        .info-pajak th {
            width: 25%;
            padding: 5px;
            vertical-align: top;
            border-left: 2px solid white;
            border-right: 2px solid white;
        }

        .info-table,
        .data-table,
        .data-detail {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .info-pajak td,
        .data-table th,
        .data-detail td,
        .data-table td {
            padding: 5px;
            vertical-align: top;
        }

        .data-table th {
            background-color: navy;
            color: white;
            text-align: left;
            vertical-align: top
        }

        .data-detail th {
            background-color: #d9d9d9;
            color: black !important;
            text-align: center;
            border: 2px solid white;
            vertical-align: top;
        }

        .kapital {
            text-transform: capitalize;
        }
    </style>
</head>

<body>
    <div class="container">
        <table class="header-table">
            <tr>
                <td style="vertical-align: middle; width: 20%;">
                    <img src="{{ public_path('images/logo.png') }}" alt="Tax Learning System" style="width: 140px; ">
                </td>
                <td class="title" style="width: 60%;">
                    <p>BUKTI PEMOTONGAN DAN/ATAU PEMUNGUTAN <br> UNIFIKASI BERFORMAT STANDART</p>
                </td>
                <td class="yellow-box" style="width: 20%;">
                    @if(request()->route()->getName() === 'bppu.downloadPDF')
                    BPPU
                    @elseif(request()->route()->getName() === 'bpnr.downloadPDF')
                    BPNR
                    @elseif(request()->route()->getName() === 'bp21.downloadPDF')
                    BP21
                    @elseif(request()->route()->getName() === 'bp26.downloadPDF')
                    BP26
                    @elseif(request()->route()->getName() === 'bpa1.downloadPDF')
                    BPA1
                    @elseif(request()->route()->getName() === 'bpa2.downloadPDF')
                    BPA2
                    @elseif(request()->route()->getName() === 'sp.downloadPDF')
                    SP
                    @elseif(request()->route()->getName() === 'cy.downloadPDF')
                    CY
                    @elseif(request()->route()->getName() === 'mp.downloadPDF')
                    MP
                    @else
                    BUPOT
                    @endif
                </td>
            </tr>
        </table>

        <table class="info-pajak">
            <tr>
                <td><strong>NOMOR</strong></td>
                <td><strong>MASA PAJAK</strong></td>
                <td><strong>SIFAT PEMOTONGAN DAN/ATAU PEMUNGUTAN PPH</strong></td>
                <td><strong>STATUS BUKTI PEMOTONGAN / PEMUNGUTAN</strong></td>
            </tr>
            <tr>
                <td>{{ $bupot->bupot_number }}</td>
                <td>{{ $bupot->bupot_period }} {{ $bupot->bupot_year }}</td>
                <td class="kapital">{{ $bupot->object->tax_nature }}</td>
                <td>{{ $bupot->bupot_status === 'normal' ? 'NORMAL' : 'PEMBETULAN' }}</td>
            </tr>
        </table>

        <table class="data-table">
            <tr>
                <th colspan="6">A. IDENTITAS WAJIB PAJAK YANG DIPOTONG DAN/ATAU DIPUNGUT PPH ATAU PENERIMA PENGHASILAN
                </th>
            </tr>
            <tr>
                <td><strong>A.1</strong></td>
                <td><strong>NPWP / NIK</strong></td>
                <td><strong>: {{ $bupot->customer_id }}</strong></td>
            </tr>
            <tr>
                <td><strong>A.2</strong></td>
                <td><strong>NAMA</strong></td>
                <td><strong>: {{ $bupot->customer_name }}</strong></td>
            </tr>
            <tr>
                <td><strong>A.3</strong></td>
                <td><strong>NOMOR IDENTITAS TEMPAT KEGIATAN USAHA (NITKU)</strong></td>
                <td><strong>: {{ $bupot->customer_id }}000000 - {{ $bupot->customer_name }}</strong></td>
            </tr>
        </table>

        <table class="data-table">
            <tr>
                <th colspan="6">B. PEMOTONGAN DAN/ATAU PEMUNGUTAN PPH</th>
            </tr>
            <tr>
                <td><strong>B.1</strong></td>
                <td><strong>Jenis Fasilitas</strong></td>
                <td class="kapital"><strong>: {{ $bupot->facility }}</strong></td>
            </tr>
            <tr>
                <td><strong>B.2</strong></td>
                <td><strong>Jenis PPh</strong></td>
                <td><strong>: {{ $bupot->object->tax_type }}</strong></td>
            </tr>
            <tr>
                <td><strong></strong></td>
                <td colspan="5">
                    <table class="data-detail">
                        <tr>
                            <th>KODE OBJEK PAJAK <br> B.3</th>
                            <th>OBJEK PAJAK <br> B.4</th>
                            <th>DPP <br> (Rp) <br> B.5</th>
                            <th>Tarif <br> (%) <br> B.6</th>
                            <th>PAJAK PENGHASILAN <br> (Rp) <br> B.7</th>
                        </tr>
                        <tr>
                            <td><strong>{{ $bupot->object->tax_code }}</strong></td>
                            <td><strong>{{ $bupot->object->tax_name }}</strong></td>
                            <td><strong>{{ number_format($bupot->dpp, 0, ',', '.') }}</strong></td>
                            <td><strong>
                                    @if(request()->route()->getName() === 'bp21.downloadPDF')
                                    {{ $bupot->object->tax_rates }}
                                    @else
                                    {{ $bupot->rates }}
                                    @endif
                                </strong></td>
                            <td><strong>{{ number_format($bupot->tax, 0, ',', '.') }}</strong></td>
                        </tr>
                </td>
            </tr>
            <tr>
                <td><strong>B.8</strong></td>
                <td><strong>Dokumen Dasar Bukti Pemotongan dan/atau Pemungutan Unifikasi atau Dasar Pemberian
                        Fasilitas</strong></td>
                <td class="kapital"><strong>Jenis Dokumen : {{ $bupot->doc_type }}</strong></td>
                <td><strong>Tanggal : {{ $bupot->doc_date }}</strong></td>
            </tr>
            <tr>
                <td><strong>B.9</strong></td>
                <td></td>
                <td><strong>Nomor Dokumen : {{ $bupot->doc_no }}</strong></td>
            </tr>
            <tr>
                <td><strong>B.10</strong></td>
                <td><strong>Untuk Instansi Pemerintah, Pembayaran PPh Menggunakan : </strong></td>
            </tr>
            <tr>
                <td><strong>B.11</strong></td>
                <td></td>
                <td><strong>Nomor SP2D : </strong></td>
            </tr>
        </table>

        <table class="data-table">
            <tr>
                <th colspan="6">C. IDENTITAS PEMOTONG DAN/ATAU PEMUNGUT PPH</th>
            </tr>
            <tr>
                <td><strong>C.1</strong></td>
                <td><strong>NPWP / NIK</strong></td>
                <td><strong>: {{ $user->npwp }}</strong></td>
            </tr>
            <tr>
                <td><strong>C.2</strong></td>
                <td><strong>NOMOR IDENTITAS TEMPAT KEGIATAN USAHA (NITKU) / SUBUNIT ORGANISASI</strong></td>
                <td><strong>: {{ $user->npwp }}000000 - {{ $user->name }}</strong></td>
            </tr>
            <tr>
                <td><strong>C.3</strong></td>
                <td><strong>NAMA PEMOTONG DAN/ATAU PEMUNGUT PPH</strong></td>
                <td><strong>: {{ $user->name }}</strong></td>
            </tr>
            <tr>
                <td><strong>C.4</strong></td>
                <td><strong>TANGGAL</strong></td>
                <td><strong>: {{ $bupot->created_at }}</strong></td>
            </tr>
            <tr>
                <td><strong>C.5</strong></td>
                <td><strong>NAMA PENANDATANGANAN</strong></td>
                <td><strong>: {{ $user->name }}</strong></td>
            </tr>
            <tr>
                <td><strong>C.6</strong></td>
                <td><strong>PERNYATAAN WAJIB PIHAK</strong></td>
                <td><strong>: Dengan ini saya menyatakan bahwa bukti Pemotongan/Pemungutan Unifikasi telah saya isi
                        dengan benar dan telah saya tandatangani secara elektronik.</strong></td>
            </tr>
        </table>
    </div>
</body>

</html>