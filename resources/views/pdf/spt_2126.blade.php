<!DOCTYPE html>
<html>

<head>
    <title>SPT Masa Pph 21/26</title>
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

        .kemenkeu {
            text-align: left;
            font-size: 12px;
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

        .table-header {
            background-color: #d9d9d9;
            font-weight: bold;
            text-align: center;
        }

        .info-pajak {
            width: 100%;
            border-collapse: collapse;
            background-color: #d9d9d9;
            text-align: center;
        }

        .info-table,
        .data-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f2f2f2;
        }
        .data-ttd {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .info-pajak td,
        .info-table td,
        .data-table th,
        .data-table td {
            border: 1px solid white;
            padding: 5px;
        }

        .data-table th {
            background-color: #d9d9d9;
            text-align: left;
        }

        .text-right {
            text-align: right;
        }

        .section-title {
            font-weight: bold;
            margin-top: 15px;
            background-color: #d9d9d9;
            padding: 5px;
        }

        .signature {
            margin-top: 20px;
            text-align: right;
        }

        .signature div {
            margin-top: 50px;
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
                    <p>SURAT PEMBERITAHUAN MASA <br> PAJAK PENGHASILAN (SPT MASA PPH) <br> PASAL 21 DAN/ATAU 26</p>
                </td>
                <td class="yellow-box" style="width: 20%;">
                    INDUK
                </td>
            </tr>
        </table>

        <table class="info-pajak">
            <tr>
                <td><strong>Masa Pajak</strong></td>
                <td><strong>Tahun Pajak</strong></td>
                <td><strong>Status</strong></td>
            </tr>
            <tr>
                <td>{{ $spt->start_period }}</td>
                <td>{{ $spt->year }}</td>
                <td>{{ $spt->correction_number === 0 ? 'NORMAL' : 'PEMBETULAN' }}</td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td colspan="4" style="text-align: left; background-color: blue; color: #ffffff"><strong>A. IDENTITAS PEMOTONG</strong></td>
            </tr>
            <tr style="text-align: left;">
                <td style="width: 20%"><strong>A.1 NPWP/NIP</strong></td>
                <td style="width: 80%">: {{ $user->npwp }}</td>
            </tr>
            <tr>
                <td><strong>A.2 Nama</strong></td>
                <td>: {{ $user->name }}</td>
            </tr>
            <tr>
                <td><strong>A.3 Alamat</strong></td>
                <td>: {{ $user->address }}</td>
            </tr>   
            <tr>
                <td><strong>A.4 No. Telepon</strong></td>
                <td>: {{ $user->phone_number }}</td>
            </tr>
        </table>

        <table class="data-table">
            <tr>
                <td colspan="4" style="text-align: left;background-color: blue; color: #ffffff"><strong>B. PAJAK PENGHASILAN PASAL 21</strong></td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: left;background-color: #d9d9d9; color: #000000"><strong>I. PAJAK PENGHASILAN PASAL 21 YANG DILAKUKAN PEMOTONGAN</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td ><strong>NO</strong></td>
                <td ><strong> URAIAN</strong></td>
                <td ><strong>KAP-KJS</strong></td>
                <td ><strong>JUMLAH (Rp) </strong></td>
            </tr>
            
            <tr style="text-align: center; height: 2px">
                <td >B.1</td>
                <td>B.2</td>
                <td>B.3</td>
                <td>B.4</td>
            </tr>
            <tr>
                <td style="text-align: center">1.</td>
                <td style="text-align: left;">PPh Pasal 21 yang Dipotong</td>
                <td style="text-align: center;">411121-100</td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha1, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center">2.</td>
                <td style="text-align: left;">Kelebihan Penyetoran PPh Pasal 21 dari Masa Pajak Sebelumnya</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha2, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center">3.</td>
                <td style="text-align: left;">Pembayaran PPh Pasal 21 dengan SP2D (Hanya untuk Instansi Pemerintah)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha3, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center">4.</td>
                <td style="text-align: left;">PPh Pasal 21 yang Kurang (Lebih) Disetor (1-2-3) (Apabila ada lebih setor akan dikompensasikan)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha4, 0,',','.') }}</td>
            </tr>
            
            <tr>
                <td style="text-align: center">5.</td>
                <td style="text-align: left;">PPh Pasal 21 yang Kurang (Lebih) Disetor pada SPT yang Dibetulkan</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha5, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center">6.</td>
                <td style="text-align: left;">PPh Pasal 21 yang Kurang (Lebih) Disetor Karena Pembetulan (4-5) (Apabila ada Lebih Setor akan dikompensasikan)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->ppha6, 0,',','.') }}</td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: left;background-color: #d9d9d9; color: #000000"><strong>II. PAJAK PENGHASILAN PASAL 21 DITANGGUNG PEMERINTAH</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td ><strong>NO</strong></td>
                <td ><strong> URAIAN</strong></td>
                <td ><strong>KAP-KJS</strong></td>
                <td ><strong>JUMLAH (Rp) </strong></td>
            </tr>
            <tr style="text-align: center;">
                <td>B.5</td>
                <td>B.6</td>
                <td>B.7</td>
                <td>B.8</td>
            </tr>
            <tr>
                <td style="text-align: center">1.</td>
                <td style="text-align: left;">PPh Pasal 21 Ditanggung Pemerintah</td>
                <td style="text-align: center;">411121-100</td>
                <td class="text-right">{{ number_format($spt->spt2126->pphapemerintah, 0,',','.') }}</td>
            </tr>
         
        </table>
        <table class="data-table">
            <tr>
                <td colspan="4" style="text-align: left;background-color: blue; color: #ffffff"><strong>C. PAJAK PENGHASILAN PASAL 26</strong></td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: left;background-color: #d9d9d9; color: #000000"><strong>I. PAJAK PENGHASILAN PASAL 26 YANG DILAKUKAN PEMOTONGAN</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td ><strong>NO</strong></td>
                <td ><strong>URAIAN</strong></td>
                <td ><strong>KAP-KJS</strong></td>
                <td ><strong>JUMLAH (Rp) </strong></td>
            </tr>
            
            <tr style="text-align: center;">
                <td>C.1</td>
                <td>C.2</td>
                <td>C.3</td>
                <td>C.4</td>
            </tr>
            <tr>
                <td style="text-align: center" >1.</td>
                <td style="text-align: left;">PPh Pasal 26 yang Dipotong</td>
                <td style="text-align: center;">411127-100</td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb1, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center" >2.</td>
                <td style="text-align: left;">Kelebihan Penyetoran PPh Pasal 26 dari Masa Pajak Sebelumnya</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb2, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center" >3.</td>
                <td style="text-align: left;">Pembayaran PPh Pasal 26 dengan SP2D (Hanya untuk Instansi Pemerintah)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb3, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center" >4.</td>
                <td style="text-align: left;">PPh Pasal 26 yang Kurang (Lebih) Disetor (1-2-3) (Apabila ada lebih setor akan dikompensasikan)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb4, 0,',','.') }}</td>
            </tr>
            
            <tr>
                <td style="text-align: center" >5.</td>
                <td style="text-align: left;">PPh Pasal 26 yang Kurang (Lebih) Disetor pada SPT yang Dibetulkan</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb5, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: center" >6.</td>
                <td style="text-align: left;">PPh Pasal 26 yang Kurang (Lebih) Disetor Karena Pembetulan (4-5) (Apabila ada Lebih Setor akan dikompensasikan)</td>
                <td style="text-align: center;"></td>
                <td class="text-right">{{ number_format($spt->spt2126->pphb6, 0,',','.') }}</td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: left;background-color: #d9d9d9; color: #000000"><strong>II. PAJAK PENGHASILAN PASAL 26 DITANGGUNG PEMERINTAH</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td ><strong>NO</strong></td>
                <td ><strong> URAIAN</strong></td>
                <td ><strong>KAP-KJS</strong></td>
                <td ><strong>JUMLAH (Rp) </strong></td>
            </tr>
            <tr style="text-align: center;">
                <td>C.5</td>
                <td>C.6</td>
                <td>C.7</td>
                <td>C.8</td>
            </tr>
            <tr>
                <td style="text-align: center;">1.</td>
                <td style="text-align: left;">PPh Pasal 26 Ditanggung Pemerintah</td>
                <td style="text-align: center;">411127-100</td>
                <td class="text-right">{{ number_format($spt->spt2126->pphbpemerintah, 0,',','.') }}</td>
            </tr>
         
        </table>

        <table class="data-ttd">
            <tr >
                <th colspan="4" style="background-color: blue; color: #ffffff"><strong>PERNYATAAN DAN TANDA TANGAN</strong></th>
            </tr>

            <tr style="padding-top: 10px" >   
                <td style="width:5%"><strong>D.1 </strong></td>
                <td style="text-align: left; width:25%"><strong>Wajib Pajak</strong></td>
                <td style="width: 30%"></td>
                <td style="text-align: center;vertical-align: middle; width:40%">Tanda Tangan</td>
            </tr>
            <tr>
                <td><strong>D.2 </strong></td>
                <td style="text-align: left;"><strong>Kuasa</strong></td>
                <td>    </td>
                <td colspan="3" rowspan="3" style="vertical-align: middle; text-align:center;">
                    <img src="{{ public_path('images/barcode.png') }}" alt="Tax Learning System" style="width: 50px; "></td>
            </tr>
            
            <tr >
                <td><strong>D.3 </strong></td>
                <td style="text-align: left;"><strong>Nama</strong></td>
                <td style="text-align: left;">: {{ $spt->spt2126->ttd_name }}</td>
                
            </tr>
            <tr style="text-align: left;">
                <td><strong>D.4 </strong></td>
                <td style="text-align: left;"><strong>Tanggal</strong></td>
                <td style="text-align: left;">: {{ $spt->spt2126->created_at->format('d F Y') }}</td>
            </tr>
            <tr style="text-align: left;">
                <td><strong>D.5 </strong></td>
                <td style="text-align: left;"><strong>Pernyataan Wajib Pajak</strong></td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td colspan="6" style="text-align: left;">Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan
                    ketentuan perundang-undangan yang berlaku, Saya menyatakan bahwa apa yang telah Saya
                    beritahukan di atas adalah benar, lengkap, dan jelas.</td>
            </tr>
        </table>
    </div>
</body>

</html>