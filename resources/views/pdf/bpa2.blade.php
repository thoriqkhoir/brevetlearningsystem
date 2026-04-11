<!DOCTYPE html>
<html>

<head>
    <title>Bukti Pemotongan PPh Pasal 21 (A2)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            margin: 0;
            padding: 20px;
        }

        .container {
            margin: auto;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .header-table td {
            vertical-align: middle;
        }

        .title {
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            text-transform: uppercase;
        }

        .yellow-box {
            background-color: #FFD700;
            text-align: center;
            font-weight: bold;
            padding: 12px;
            font-size: 16px;
        }

        .info-header {
            width: 100%;
            border-collapse: collapse;
            background-color: #d9d9d9;
            text-align: center;
            margin-bottom: 15px;
        }

        .info-header td {
            padding: 8px;
            border: 1px solid white;
            font-weight: bold;
        }

        .section-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .section-header {
            background-color: navy;
            color: white;
            padding: 8px;
            font-weight: bold;
            text-align: left;
        }

        .section-table td {
            padding: 5px;
            vertical-align: top;
        }

        .field-row {
            border-bottom: 1px solid #e0e0e0;
        }

        .field-label {
            width: 5%;
            font-weight: bold;
        }

        .field-name {
            width: 25%;
            font-weight: bold;
        }

        .field-value {
            width: 20%;
        }

        .subsection-header {
            background-color: #f0f0f0;
            padding: 6px;
            font-weight: bold;
            margin-top: 5px;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }

        .detail-table td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .detail-table .label-col {
            width: 70%;
            background-color: #f9f9f9;
        }

        .detail-table .value-col {
            width: 30%;
            text-align: right;
            font-weight: bold;
        }

        .kapital {
            text-transform: capitalize;
        }

        .text-right {
            text-align: right;
        }

        .highlight {
            background-color: #fffacd;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- HEADER -->
        <table class="header-table">
            <tr>
                <td style="width: 20%;">
                    <img src="{{ public_path('images/logo.png') }}" alt="Brevet Learning System" style="width: 140px;">
                </td>
                <td class="title" style="width: 60%;">
                    <p>BUKTI PEMOTONGAN PAJAK PENGHASILAN<br>PASAL 21 BAGI PEGAWAI TETAP ATAU PENSIUNAN<br>(FORMULIR 1721-A2)</p>
                </td>
                <td class="yellow-box" style="width: 20%;">
                    BPA2
                </td>
            </tr>
        </table>

        <!-- INFO HEADER -->
        <table class="info-header">
            <tr>
                <td style="width: 20%;">NOMOR<br>{{ $bupot->bupot_number ?? '-' }}</td>
                <td style="width: 30%;">MASA PAJAK<br>{{ $bupot->start_period ?? '-' }} s/d {{ $bupot->end_period ?? '-' }}</td>
                <td style="width: 30%;">SIFAT PEMOTONGAN<br>TIDAK FINAL</td>
                <td style="width: 20%;">STATUS<br>{{ strtoupper($bupot->bupot_status ?? 'normal') }}</td>
            </tr>
        </table>

        <!-- SECTION A: IDENTITAS PENERIMA PENGHASILAN -->
        <table class="section-table">
            <tr>
                <td colspan="6" class="section-header">
                    A. IDENTITAS PENERIMA PENGHASILAN YANG DIPOTONG
                </td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.1</td>
                <td class="field-name">NIK/NPWP</td>
                <td class="field-value">: {{ $bupot->customer_id }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.2</td>
                <td class="field-name">Nama</td>
                <td class="field-value">: {{ $bupot->customer_name }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.3</td>
                <td class="field-name">NIP/NRP</td>
                <td class="field-value">: {{ $bupot->nip ?? '-' }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.4</td>
                <td class="field-name">Pangkat/Golongan</td>
                <td class="field-value">: {{ $bupot->rank_group ?? '-' }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.5</td>
                <td class="field-name">Status PTKP</td>
                <td class="field-value">: {{ $bupot->customer_ptkp }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
            <tr class="field-row">
                <td class="field-label">A.6</td>
                <td class="field-name">Posisi</td>
                <td class="field-value">: {{ $bupot->customer_position }}</td>
                <td class="field-label"></td>
                <td class="field-name"></td>
                <td class="field-value"></td>
            </tr>
        </table>

        <!-- SECTION B: RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21 -->
        <table class="section-table" style="margin-bottom: 5px;">
            <tr>
                <td colspan="3" class="section-header">
                    B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21
                </td>
            </tr>
        </table>

        <!-- B.1.1 Header Info -->
        <table class="section-table" style="margin-bottom: 10px; font-size: 9px;">
            <tr>
                <td style="width: 4%; padding: 1px;"><strong>B.1.1</strong></td>
                <td style="width: 8%; padding: 1px;"><strong>Kode Objek Pajak</strong></td>
                <td style="width: 12%; padding: 1px;"><strong>: {{ $bupot->tax_code ?? '21-100-01' }}</strong></td>
                <td style="width: 4%; padding: 1px;"><strong>B.1.2</strong></td>
                <td style="width: 8%; padding: 1px;"><strong>Objek Pajak</strong></td>
                <td style="width: 24%; padding: 1px;"><strong>: {{ $bupot->object->tax_name ?? 'Penghasilan yang Diterima atau Diperoleh Pegawai Tetap' }}</strong></td>
            </tr>
            <tr>
                <td style="padding: 1px;"><strong>B.2</strong></td>
                <td style="padding: 1px;"><strong>Jenis Pemotongan</strong></td>
                <td colspan="4" style="padding: 1px;"><strong>: {{ $bupot->bupot_types ?? 'Setahun Penuh' }}</strong></td>
            </tr>
        </table>

        <!-- B.3 Tabel Penghasilan Bruto -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #000;">
            <thead>
                <tr style="background-color: #818181;">
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 8%; font-weight: bold;">NO</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">URAIAN</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 20%; font-weight: bold;">JUMLAH (Rp)</th>
                </tr>
                <tr style="background-color: #818181;">
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">B.3</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">B.4</th>
                    <th style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">B.5</th>
                </tr>
            </thead>
            <tbody>
                <!-- I. PENGHASILAN BRUTO -->
                <tr style="background-color: #bdbdbd;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">I</td>
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">PENGHASILAN BRUTO</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">1.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Gaji Pokok/Tunjangan Dasar Lainnya</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->basic_salary ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">2.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Istri</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->wifes_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">3.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Anak</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->childs_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">4.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Perbaikan Penghasilan</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->income_improvement_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">5.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Fungsional</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->fungtional_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">6.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Beras</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->rice_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">7.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Tunjangan Lainnya</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->other_allowance ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">8.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Gaji Terpisah</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->separate_salary ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color:#ffffff;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">9.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Jumlah Penghasilan Bruto (1 s.d 8)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->gross_income_amount ?? 0, 0, ',', '.') }}</td>
                </tr>

                <!-- II. PENGURANG PENGHASILAN BRUTO -->
                <tr style="background-color: #bdbdbd;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">II</td>
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">PENGURANG PENGHASILAN BRUTO</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">10.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Biaya Jabatan / Biaya Pensiun</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->position_cost ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">11.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Iuran Pensiun atau Iuran THT/JHT</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pension_contribution ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">12.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Zakat atau Sumbangan Keagamaan yang Bersifat Wajib</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->zakat_donation ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">13.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Jumlah Pengurangan (10 s.d 12)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->amount_of_reduction ?? 0, 0, ',', '.') }}</td>
                </tr>

                <!-- III. PENGHITUNGAN PPh PASAL 21 -->
                <tr style="background-color: #bdbdbd;">
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold; text-align: center;">III</td>
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">PENGHITUNGAN PPh PASAL 21</td>
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold; text-align: right;"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">14.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Jumlah Penghasilan Neto (9 - 13)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->neto ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">15.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Nomor Bukti</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ $bupot->proof_number ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">16.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Penghasilan Neto dari Pemotongan Sebelumnya</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->before_neto ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">17.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun/Disetahunkan)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->total_neto ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">18.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Penghasilan Tidak Kena Pajak (PTKP)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->non_taxable_income ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">19.</td>
                    <td style="border: 1px solid #000; padding: 5px;">Penghasilan Kena Pajak Setahun / Disetahunkan (PKP) (17 - 18)</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->taxable_income ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">20.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 atas PKP</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_taxable_income ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">21.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 yang Telah Ditanggung Pemerintah</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_owed ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">22.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 dan PPh Pasal 26 yang Telah Dipotong dan Dilunasi</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_deducted ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">23.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 Terutang</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_deducted_withholding ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">24.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 yang Telah Dipotong</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_hasbeen_deducted ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">25.</td>
                    <td style="border: 1px solid #000; padding: 5px;">PPh Pasal 21 Desember atau yang Dipotong Pegawai Tetap Berhenti Bekerja</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">{{ number_format($bupot->pph_desember ?? 0, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION C: IDENTITAS PEMOTONG PPh -->
        <table class="section-table">
            <tr>
                <td colspan="3" class="section-header">
                    C. IDENTITAS PEMOTONG PPh
                </td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.1</td>
                <td class="field-name">NPWP/NIK</td>
                <td class="field-value">: {{ $user->npwp }}</td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.2</td>
                <td class="field-name">KAP</td>
                <td class="field-value">: {{ $bupot->kap ?? '-' }}</td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.3</td>
                <td class="field-name">NITKU atau Nomor Identitas Sub Unit Organisasi</td>
                <td class="field-value">: {{ $bupot->nitku ?? ($user->npwp . '000000 - ' . $user->name) }}</td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.4</td>
                <td class="field-name">Nama Pemotong</td>
                <td class="field-value">: {{ $user->name }}</td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.5</td>
                <td class="field-name">Tanggal</td>
                <td class="field-value">: {{ \Carbon\Carbon::parse($bupot->created_at)->format('d F Y') }}</td>
            </tr>
            <tr class="field-row">
                <td class="field-label">C.6</td>
                <td class="field-name">Nama Penandatangan</td>
                <td class="field-value">: {{ $user->name }}</td>
            </tr>
            <tr>
                <td class="field-label">C.7</td>
                <td colspan="2" class="field-name">
                    <strong>Pernyataan</strong><br>
                    Dengan ini saya menyatakan bahwa Bukti Pemotongan ini telah saya isi dengan benar dan telah saya tandatangani secara elektronik.
                    <br><br>
                    Sesuai dengan ketentuan yang berlaku, Direktur Jenderal Pajak menyatakan bahwa Bukti Pemotongan ini dianggap sah dan tidak diperlukan tanda tangan basah.
                </td>
            </tr>
        </table>

        <!-- QR Code and Footer -->
        <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #999;">
            <p>Ditandatangani secara elektronik</p>
        </div>
    </div>
</body>

</html>