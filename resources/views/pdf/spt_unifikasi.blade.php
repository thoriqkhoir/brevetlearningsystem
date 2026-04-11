<!DOCTYPE html>
<html>

<head>
    <title>SPT Masa PPh Unifikasi</title>
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
        }

        .info-pajak td {
            width: 50%;
        }
 
        .info-table,
        .data-table,
        .data-ttd {
            width: 100%;
            border-collapse: collapse;
            background-color: #f2f2f2;
        }

        .text-right {
            text-align: right;  
        }
        .info-pajak td,
        .info-table td,
        .data-table th,
        .data-table td
         {
            border: 1px solid white;
            padding: 5px;
        }

        .data-ttd td,
        .data-ttd th {
            border: 1px solid white;
            padding: 5px;
        }
        
        .info-table td {
            text-align: left;
            width: auto;
        }

        .table-header {
            background-color: #d9d9d9;
            font-weight: bold;
            text-align: center;
        }
        .data-table td:first-child {
        width: 2%;
    }
        

        .footer {
            margin-top: 40px;
            text-align: right;
            font-size: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <table class="header-table ">
            <tr>
                <td style="vertical-align: middle; width: 20%;">
                    <img src="{{ public_path('images/logo.png') }}" alt="Brevet Learning System" style="width: 140px; ">
                </td>
                <td class="title" style="width: 60%;">
                    <p>SURAT PEMBERITAHUAN MASA <br> PAJAK PENGHASILAN UNIFIKASI</p>
                </td>
                <td class="yellow-box" style="width: 20%; ">
                    INDUK
                </td>
            </tr>
        </table>

        <table class="info-pajak">
            <tr>
                <td><strong>Masa Pajak</strong></td>
                <td><strong>Normal/Pembetulan</strong></td>
            </tr>
            <tr>
                <td>{{ $spt->start_period }} {{ $spt->year }}</td>
                <td>{{ $spt->correction_number === 0 ? 'NORMAL' : 'PEMBETULAN' }}</td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td colspan="4" style="text-align: left; background-color: blue; color: #ffffff"><strong>A. Identitas Pemotong dan/atau Pemungut PPh</strong></td>
            </tr>
            <tr style="text-align: left;">
                <td style="width: 20%"><strong>A.1 NPWP/NIP</strong></td>
                <td style="width: 80%">: {{ $user->npwp }}</td>
            </tr>
            <tr>
                <td><strong>A.2 Nama PKP</strong></td>
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
                <td colspan="8" style="text-align: left;     background-color: blue; color: #ffffff"><strong>B. Pajak Penghasilan</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td rowspan="2"><strong>NO</strong></td>
                <td rowspan="2" style="width: 20%;"><strong>DETIL</strong></td>
                <td colspan="2"><strong>PAJAK PENGHASILAN</strong></td>
                <td rowspan="2"><strong>PPH YANG DITANGGUNG PEMERINTAH </strong></td>
                <td rowspan="2"><strong>JUMLAH PPH YANG HARUS DISETOR </strong></td>
                <td rowspan="2" style="width: 15%;"><strong>JUMLAH PPH YANG TELAH DISETOR PADA SPT YANG DIBETULKAN</strong></td>
                <td rowspan="2"><strong> PPH KURANG (LEBIH) SETOR KARENA PEMBETULAN</strong></td>
            </tr>
            <tr>
                <td style="width: 8%; text-align: center;"><strong>Setor Sendiri</strong></td>
                <td style="text-align: center;"><strong>Pemotongan dan Pemungutan PPh</strong></td>
            </tr>
            <tr style="text-align: center;">
                <td>B.1</td>
                <td>B.2</td>
                <td>B.3</td>
                <td>B.4</td>
                <td>B.5</td>
                <td>B.6</td>
                <td>B.7</td>
                <td>B.8</td>
            </tr>
            <tr>
                <td rowspan="4" >1</td>
                <td style="text-align: left;">PPh Pasal 4 ayat 2</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->setor_1, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pemotongan_1, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphpemerintah_1, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->jumlahpph_1, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphdibetulkan_1, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphkurangbayar_1, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411128-100</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411128-402</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411128-403</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            
            <tr>
                <td rowspan="3" >2</td>
                <td style="text-align: left;">PPh Pasal 15</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->setor_2, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pemotongan_2, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphpemerintah_2, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->jumlahpph_2, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphdibetulkan_2, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphkurangbayar_2, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411128-600</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411129-600</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>

            <tr>
                <td rowspan="4">3</td>
                <td style="text-align: left;">PPh Pasal 22</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->setor_3, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pemotongan_3, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphpemerintah_3, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->jumlahpph_3, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphdibetulkan_3, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphkurangbayar_3, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411122-100</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411122-900</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411122-910</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>

            <tr>
                <td rowspan="2">4</td>
                <td style="text-align: left;">PPh Pasal 23</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->setor_4, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pemotongan_4, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphpemerintah_4, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->jumlahpph_4, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphdibetulkan_4, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphkurangbayar_4, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411124-100</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td rowspan="2">5</td>
                <td style="text-align: left;">PPh Pasal 26</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->setor_5, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pemotongan_5, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphpemerintah_5, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->jumlahpph_5, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphdibetulkan_5, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->pphkurangbayar_5, 0,',','.') }}</td>
            </tr>
            <tr>
                <td style="text-align: left;">KJS : 411127-110</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
            </tr>
            <tr>
                <td><strong>Total PPh</strong></td>
                <td></td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_setor, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_pemotongan, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_pphpemerintah, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_jumlahpph, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_pphdibetulkan, 0,',','.') }}</td>
                <td class="text-right">{{ number_format($spt->sptUnifikasi->total_pphkurangbayar, 0,',','.') }}</td>
            </tr>
         
        </table>
        <table class="data-ttd">
            <tr>
                <th colspan="8" style="background-color: blue; color: #ffffff"><strong>PERNYATAAN DAN TANDA TANGAN</strong></th>
            </tr>

            <tr >
                <td style="width:5%"><strong>C.1 </strong></td>
                <td style="text-align: left; width:25%"><strong>Wajib Pajak</strong></td>
                <td style="width: 2%"></td>
                <td style="width: 25%"></td>
                <td style="text-align: center;vertical-align: middle; width:43%"><strong>C.5</strong></td>
            </tr>
            <tr>
                <td><strong>C.2 </strong></td>
                <td style="text-align: left;"><strong>Nama</strong></td>
                <td>:</td>
                <td style="text-align: left;">{{ $spt->sptUnifikasi->ttd_name }}</td>
                <td colspan="3" rowspan="3" style="vertical-align: middle; text-align:center;">
                    <img src="{{ public_path('images/barcode.png') }}" alt="Brevet Learning System" style="width: 50px; "></td>
            </tr>
            
            <tr >
                <td><strong>C.3 </strong></td>
                <td style="text-align: left;"><strong>Tanggal</strong></td>
                <td>:</td>
                <td style="text-align: left;">{{ $spt->sptUnifikasi->created_at->format('d F Y') }}</td>
                
            </tr>
            <tr style="text-align: left;">
                <td><strong>C.4 </strong></td>
                <td style="text-align: left;"><strong>PERNYATAAN WAJIB PAJAK</strong></td>
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
