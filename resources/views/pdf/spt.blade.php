<!DOCTYPE html>
<html>

<head>
    <title>SPT Masa PPN</title>
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

        .right-text {
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
                    <img src="{{ public_path('images/logo.png') }}" alt="Brevet Learning System" style="width: 140px; ">
                </td>
                <td class="title" style="width: 60%;">
                    <p>SURAT PEMBERITAHUAN MASA <br> PAJAK PERTAMBAHAN NILAI (SPT MASA PPN) <br> BAGI PENGUSAHA KENA
                        PAJAK</p>
                </td>
                <td class="yellow-box" style="width: 20%;">
                    INDUK
                </td>
            </tr>
        </table>

        <table class="info-pajak">
            <tr>
                <td><strong>Masa Pajak</strong></td>
                <td><strong>Tahun Buku</strong></td>
                <td><strong>Normal/Pembetulan</strong></td>
            </tr>
            <tr>
                <td>{{ $spt->start_period }} {{ $spt->year }}</td>
                <td>1 s.d 12</td>
                <td>{{ $spt->correction_number === 0 ? 'NORMAL' : 'PEMBETULAN' }}</td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td><strong>Nama PKP</strong></td>
                <td>:</td>
                <td>{{ $user->name }}</td>
                <td><strong>NPWP</strong></td>
                <td>:</td>
                <td>{{ $user->npwp }}</td>
            </tr>
            <tr>
                <td><strong>Alamat</strong></td>
                <td>:</td>
                <td>{{ $user->address }}</td>
                <td><strong>KLU</strong></td>
                <td>:</td>
                <td>REAL ESTAT YANG DIMILIKI SENDIRI ATAU DISEWA</td>
            </tr>
            <tr>
                <td><strong>Telepon</strong></td>
                <td>:</td>
                <td>{{ $user->phone_number }}</td>
                <td><strong>HP</strong></td>
                <td>:</td>
                <td>{{ $user->phone_number }}</td>
            </tr>
        </table>

        <table class="data-table">
            <tr>
                <th>I. PENYERAHAN BARANG DAN JASA</th>
                <th>HARGA JUAL/ <br> PENGGANTIAN/ <br> NILAI EKSPOR/DPP <br> (Rupiah)</th>
                <th>DPP NILAI LAIN/ DPP <br> (Rupiah)</th>
                <th>PPN <br> (Rupiah)</th>
                <th>PPnBM <br> (Rupiah)</th>
            </tr>
            <tr>
                <td colspan="5">A. Penyerahan BKP/JKP yang terutang PPN</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">1. Ekspor BKP/BKP Tidak Berwujud/JKP</td>
                <td class="right-text">{{ number_format($spt->sptInduk->dpp_a1, 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td style="padding-left: 20px">2. Penyerahan yang PPN atau PPN dan PPnBM-nya harus dipungut sendiri
                    dengan DPP Nilai Lain atau Besaran Tertentu (dengan Faktur Pajak Kode 04 dan 05)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a2, 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a2 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a2 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a2 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">3. Penyerahan yang PPN atau PPN dan PPnBM-nya harus dipungut sendiri
                    kepada turis sesuai dengan Pasal 16E UU PPN (dengan Faktur Pajak Kode 06)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a3 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a3 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a3 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a3 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">4. Penyerahan yang PPN atau PPN dan PPnBM-nya harus dipungut sendiri
                    lainnya (dengan Faktur Pajak Kode 01, 09 dan 10)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a4 , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a4 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a4 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">5. Penyerahan yang PPN atau PPN dan PPnBM-nya harus dipungut sendiri
                    dengan Faktur Pajak yang dilaporkan secara digunggung</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a5 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a5 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a5 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a5 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">6. Penyerahan yang PPN atau PPN dan PPnBM-nya harus dipungut oleh
                    Pemungut PPN (dengan Faktur Pajak Kode 02 dan 03)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a6 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a6 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a6 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a6 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">7. Penyerahan yang mendapat fasilitas PPN atau PPnBM Tidak Dipungut
                    (dengan Faktur Pajak Kode 07)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a7 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a7 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a7 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a7 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">8. Penyerahan yang mendapat fasilitas PPN atau PPnBM Dibebaskan
                    (dengan Faktur Pajak Kode 08)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a8 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a8 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a8 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a8 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">9. Penyerahan yang mendapat fasilitas PPN atau PPnBM dengan Faktur
                    Pajak yang dilaporkan secara digunggung</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a9 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_a9 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a9 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a9 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="padding-left: 20px">Jumlah (I.A.1 + I.A.2 + I.A.3 + I.A.4 + I.A.5 + I.A.6 + I.A.7 + I.A.8 +
                    I.A.9)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_a10 , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_a10 , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_a10 , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>B. Penyerahan barang/jasa yang tidak terutang PPN</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_ab , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>C. Jumlah seluruh penyerahan barang dan jasa (I.A + I.B)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_suma , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th>II. PEROLEHAN BARANG DAN JASA</th>
                <th>HARGA JUAL/ <br> PENGGANTIAN/ <br> NILAI IMPOR/DPP <br> (Rupiah)</th>
                <th>DPP NILAI LAIN/ DPP <br> (Rupiah)</th>
                <th>PPN <br> (Rupiah)</th>
                <th>PPnBM <br> (Rupiah)</th>
            </tr>
            <tr>
                <td>A. Impor BKP, Pemanfaatan BKP Tidak Berwujud dan/atau JKP dari luar Daerah
                    Pabean di dalam Daerah Pabean yang Pajak Masukannya dapat dikreditkan</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_ba , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_ba , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_ba , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>B. Perolehan BKP/JKP dari dalam negeri dengan DPP Nilai Lain atau Besaran
                    Tertentu yang Pajak Masukannya dapat dikreditkan (dengan Faktur Pajak Kode
                    04 dan 05)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bb , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_bb , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bb , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bb , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>C. Perolehan BKP/JKP dari dalam negeri selain dengan DPP Nilai Lain yang Pajak
                    Masukannya dapat dikreditkan (dengan Faktur Pajak Kode 01, 09, dan 10)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bc , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bc , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bc , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>D. Perolehan BKP/JKP dari dalam negeri sebagai Pemungut PPN yang Pajak
                    Masukannya dapat dikreditkan (dengan Faktur Pajak Kode 02 dan 03)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bd , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_bd , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bd , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bd , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>E. Kompensasi kelebihan Pajak Masukan</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_be , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>F. Hasil penghitungan kembali Pajak Masukan yang telah dikreditkan</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bf , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>G. Jumlah Pajak Masukan yang dapat diperhitungkan (II.A + II.B + II.C + II.D +
                    II.E + II.F)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bg , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bg , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>H. Impor atau perolehan BKP/JKP yang Pajak Masukannya tidak dikreditkan dan/
                    atau impor atau perolehan BKP/JKP yang mendapat fasilitas</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bh , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_lain_bh , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bh , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bh , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>I. Impor atau perolehan BKP/JKP dengan Faktur Pajak yang dilaporkan secara
                    digunggung dan barang/jasa yang tidak terutang PPN</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bi , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bi , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bi , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>J. Jumlah perolehan (II.A + II.B + II.C + II.D +II.H + II.I)</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->dpp_bj , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_bj , 0, ',', '.') }}</td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppnbm_bj , 0, ',', '.') }}</td>
            </tr>

            <tr>
                <th>III. PENGHITUNGAN PPN KURANG BAYAR/LEBIH BAYAR</th>
                <th></th>
                <th></th>
                <th>PPN <br> (Rupiah)</th>
                <th></th>
            </tr>
            <tr>
                <td>A. Pajak Keluaran yang harus dipungut sendiri (I.A.2 + I.A.3 + I.A.4 + I.A.5)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_ca , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>B. PPN disetor dimuka dalam Masa Pajak yang sama</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_cb , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>C. Pajak Masukan yang dapat diperhitungkan (II.G)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_cc , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>D. Kelebihan pemungutan PPN oleh Pemungut PPN</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_cd , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>E. PPN kurang atau (lebih) bayar (III.A - III.B - III.C - III.D)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_ce , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>F. PPN kurang atau (lebih) bayar pada SPT yang dibetulkan sebelumnya</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"> {{ number_format($spt->sptInduk->ppn_cf , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>G. PPN kurang atau (lebih) bayar karena pembetulan SPT (III.E - III.F)</td>
                <td class="right-text"><input type="checkbox" {{ $spt->sptInduk->spt_document == 'ya' ? 'checked' : ''
                    }}> Ganti SPT Sebelumnya</td>
                <td class="right-text"></td>
                <td class="right-text">{{ $spt->sptInduk->ppn_cg }}</td>
                <td class="right-text"></td>
            </tr>
            <tr>
                <td>H. diminta untuk:

                    <ul style="list-style-type: none; padding: 0;">
                        <li>
                            <input type="checkbox" {{ $spt->sptInduk->ppn_ch == 'Dikompensasikan' ? 'checked' : '' }}>
                            Dikompensasikan
                        </li>
                        <li>
                            <input type="checkbox" {{ $spt->sptInduk->ppn_ch == 'dikembalikan melalui pengembalian
                            pendahuluan' ? 'checked' : '' }}>
                            dikembalikan melalui pengembalian pendahuluan
                        </li>
                        <li>
                            <input type="checkbox" {{ $spt->sptInduk->ppn_ch == 'dikembalikan melalui pemeriksaan'
                            ? 'checked' : '' }}>
                            dikembalikan melalui pemeriksaan
                        </li>
                    </ul>
                </td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th>IV. PPN TERUTANG ATAS KEGIATAN MEMBANGUN SENDIRI</th>
                <th>DPP <br> (Rupiah)</th>
                <th></th>
                <th>PPN <br> (Rupiah)</th>
                <th></th>
            </tr>
            <tr>
                <td>PPN Terutang</td>
                <td class="right-text">{{ number_format($spt->sptInduk->dpp_kms , 0, ',', '.') }}</td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format($spt->sptInduk->ppn_kms , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th>V. PEMBAYARAN KEMBALI PAJAK MASUKAN YANG TIDAK DAPAT
                    DIKREDITKAN</th>
                <th></th>
                <th></th>
                <th>PPN <br> (Rupiah)</th>
                <th></th>
            </tr>
            <tr>
                <td>PPN Yang Wajib Dibayar Kembali</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_pkpm , 0, ',', '.') }}</td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th>VI. PAJAK PENJUALAN ATAS BARANG MEWAH</th>
                <th></th>
                <th></th>
                <th></th>
                <th>PPnBM <br> (Rupiah)</th>
            </tr>
            <tr>
                <td>A. PPnBM yang harus dipungut sendiri (I.A.2 + I.A.3 + I.A.4 + I.A.5)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_da , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>B. Kelebihan pemungutan PPnBM oleh Pemungut PPN</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_db , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>C. PPnBM kurang atau (lebih) bayar (VI.A - VI.B)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_dc , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>D. PPnBM kurang atau (lebih) bayar pada SPT yang dibetulkan sebelumnya</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_dd , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>E. PPnBM kurang atau (lebih) bayar karena pembetulan SPT (VI.C - VI.D)</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_de , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>F. <input type="checkbox" {{ $spt->sptInduk->ppnbm_df == '1' ? 'checked' : '' }}> diminta
                    pengembalian pajak yang tidak seharusnya terutang</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th>VII. PEMUNGUTAN PPN ATAU PPN DAN PPNBM OLEH PEMUNGUT PPN</th>
                <th>HARGA JUAL/ <br> PENGGANTIAN/DPP <br> (Rupiah)</th>
                <th>DPP NILAI LAIN/ DPP <br> (Rupiah)</th>
                <th>PPN <br> (Rupiah)</th>
                <th>PPnBM <br> (Rupiah)</th>
            </tr>
            <tr>
                <td>A. Jumlah PPN dan PPnBM yang dipungut</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_ea , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_ea , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_ea , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_ea , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>B. PPN dan PPnBM kurang atau (lebih) bayar pada SPT yang dibetulkan sebelumnya</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_eb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_eb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_eb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_eb , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>C. PPN dan PPnBM kurang atau (lebih) bayar karena pembetulan SPT (VII.A - VII.B)</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_ec , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_ec , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_ec , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_ec , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="5" style="padding-left: 20px; font-size: 8px">Setiap kelebihan pemungutan PPN oleh Pemungut
                    PPN pada bagian ini akan dipindah ke bagian III.D untuk PPN dan VI.B untuk PPnBM.</td>
            </tr>

            <tr>
                <th>VIII. PEMUNGUTAN PPN ATAU PPN DAN PPNBM OLEH PIHAK LAIN</th>
                <th>HARGA JUAL/ <br> PENGGANTIAN/DPP <br> (Rupiah)</th>
                <th>DPP NILAI LAIN/ DPP <br> (Rupiah)</th>
                <th>PPN <br> (Rupiah)</th>
                <th>PPnBM <br> (Rupiah)</th>
            </tr>
            <tr>
                <td>A. Jumlah PPN dan PPnBM yang dipungut</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_fa , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_fa , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_fa , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_fa , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>B. PPN dan PPnBM kurang atau (lebih) bayar pada SPT yang dibetulkan sebelumnya</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_fb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_fb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_fb , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_fb , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>C. PPN dan PPnBM kurang atau (lebih) bayar karena pembetulan SPT (VIII.A - VIII.B)</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_fc , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->dpp_lain_fc , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppn_fc , 0, ',', '.') }}</td>
                <td class="right-text">{{ number_format( $spt->sptInduk->ppnbm_fc , 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>D. <input type="checkbox" {{ $spt->sptInduk->ppnbm_fd == '1' ? 'checked' : '' }}> diminta
                    pengembalian pajak yang tidak seharusnya terutang</td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
                <td class="right-text"></td>
            </tr>

            <tr>
                <th colspan="5">IX. KELENGKAPAN SPT</th>
            </tr>
            <tr>
                <td colspan="5">1. <input type="checkbox" {{ $spt->sptInduk->spt_document == 'ya' ? 'checked' : '' }}>
                    Dokumen Daftar Rincian Penyerahan Kendaraan Bermotor.</td>
            </tr>
            <tr>
                <td colspan="5">2. <input type="checkbox" {{ $spt->sptInduk->spt_result == 'ya' ? 'checked' : '' }}>
                    Hasil Penghitungan Kembali Pajak Masukan yang Telah Dikreditkan.</td>
            </tr>

            <tr>
                <th colspan="5">PERNYATAAN</th>
            </tr>
            <tr>
                <td colspan="5">Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan
                    ketentuan perundang-undangan yang berlaku, Saya menyatakan bahwa apa yang telah Saya
                    beritahukan di atas adalah benar, lengkap, dan jelas.</td>
            </tr>
        </table>

        <div class="signature">
            <p>Malang, {{ $spt->sptInduk->ttd_date }}</p>
            <div>
                <p><strong>{{ $spt->sptInduk->ttd_name }}</strong></p>
                <p><strong>{{ $spt->sptInduk->ttd_position }}</strong></p>
            </div>
        </div>

        <p style="padding: 0; margin: 0;">Perhatian:</p>
        <p style="padding: 0; margin: 0;">
            Sesuai dengan ketentuan Pasal 3 ayat (7) UU Nomor 6 Tahun 1983 dan perubahannya, apabila SPT Masa yang
            Saudara sampaikan tidak ditandatangani atau tidak sepenuhnya dilampiri keterangan dan/atau dokumen yang
            ditetapkan, maka SPT Saudara dianggap tidak disampaikan
        </p>
    </div>
</body>

</html>