<!DOCTYPE html>
<html>

<head>
    <title>Faktur Pajak</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 12px;
            line-height: 20px;
            color: #333;
        }

        .invoice-box table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-box table,
        .invoice-box table th,
        .invoice-box table td {
            border: 1px solid #000;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr.heading td {
            background: #eee;
            font-weight: bold;
            text-align: left;
            padding: 8px;
        }

        .invoice-box table tr.item td {
            padding: 8px;
        }

        .item-detail p {
            line-height: 4px;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }

        .signature {
            margin-top: 20px;
            text-align: right;
        }

        .signature p {
            margin-bottom: 50px;
        }
    </style>
</head>

<body>
    <div class="invoice-box">
        <div class="title">FAKTUR PAJAK</div>

        <table>
            <tr>
                <td><strong>Kode dan Nomor Seri Faktur Pajak:</strong></td>
                <td>{{ $invoice->invoice_number }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Pengusaha Kena Pajak</strong></td>
            </tr>
            <tr>
                <td><strong>Nama :</strong></td>
                <td>{{ $user->name }}</td>
            </tr>
            <tr>
                <td><strong>Alamat :</strong></td>
                <td>{{ $user->address }}</td>
            </tr>
            <tr>
                <td><strong>NPWP :</strong></td>
                <td>{{ $user->npwp }}</td>
            </tr>

            <tr>
                <td colspan="2"><strong>Pembeli Barang Kena Pajak</strong></td>
            </tr>
            <tr>
                <td><strong>Nama :</strong></td>
                <td>{{ $invoice->customer_name }}</td>
            </tr>
            <tr>
                <td><strong>Alamat :</strong></td>
                <td>{{ $invoice->customer_address }}</td>
            </tr>
            <tr>
                <td><strong>NPWP :</strong></td>
                <td>{{ $invoice->customer_id }}</td>
            </tr>
        </table>

        <br>

        <table>
            <tr class="heading">
                <td>No</td>
                <td>Nama Barang Kena Pajak / Jasa Kena Pajak</td>
                <td>Harga Jual/Penggantian/Uang Muka/Termin</td>
            </tr>

            @if ($invoice->items->isEmpty())
            <tr>
                <td colspan="3" class="text-center">Tidak ada item</td>
            </tr>
            @else
            @foreach ($invoice->items as $index => $item)
            <tr class="item">
                <td>{{ $index + 1 }}</td>
                <td class="item-detail">
                    <p>{{ $item['item_name'] }}</p>
                    <p>{{ $item['item_price'] }} x {{ $item['item_quantity'] }}</p>
                    <p>Potongan Harga = {{ $item['item_discount'] }}</p>
                    <p>PPnBM ({{ $item['ppnbm_rate'] }} %) = {{ $item['ppnbm'] }}</p>
                </td>
                <td class="text-right">Rp {{ number_format($item['dpp'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
            @endif

            <tr>
                <td colspan="2"><strong>Harga Jual / Penggantian</strong></td>
                <td class="text-right">Rp {{ number_format($invoice->dpp, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Dikurangi Potongan Harga</strong></td>
                <td class="text-right">Rp 0</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Dikurangi Uang Muka</strong></td>
                <td class="text-right"></td>
            </tr>
            <tr>
                <td colspan="2"><strong>Dasar Pengenaan Pajak</strong></td>
                <td class="text-right">Rp {{ number_format($invoice->dpp, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>PPN = 12% x Dasar Pengenaan Pajak</strong></td>
                <td class="text-right">Rp {{ number_format($invoice->ppn, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Total PPnBM (Pajak Penjualan Barang Mewah)</strong></td>
                <td class="text-right">Rp {{ number_format($invoice->ppnbm, 0, ',', '.') }}</td>
            </tr>
        </table>

        <br>

        <p>
            Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur Pajak ini
            telah
            ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan basah pada Faktur Pajak
            ini.
        </p>

        <div class="signature">
            <p>{{ $invoice->created_at->format('d/m/Y') }}</p>
            <p><strong>DIREKTUR</strong></p>
        </div>
    </div>
</body>

</html>