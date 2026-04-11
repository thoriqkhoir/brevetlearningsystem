{{-- filepath: resources/views/pdf/billing-group.blade.php --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing Group {{ $billing_form_id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
        }

        .logo {
            width: 150px;
        }

        .billing-code {
            font-size: 16px;
            border: 1px solid black;
            padding: 10px;
        }

        .personal-data {
            margin-bottom: 20px;
        }

        .personal-data table {
            width: 100%;
        }

        .personal-data td {
            padding: 5px 0;
        }

        .personal-data .label {
            width: 120px;
        }

        .billing-details {
            margin-bottom: 20px;
        }

        .billing-details table {
            width: 100%;
            border-collapse: collapse;
        }

        .billing-details th {
            background-color: #FACC15;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .billing-details td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .total-row {
            font-weight: bold;
        }

        .amount-in-words {
            font-style: italic;
        }

        .footer-section {
            margin-top: 30px;
        }

        .footer-container {
            display: flex;
            justify-content: space-between;
        }

        .expiry-info {
            width: 60%;
        }

        .qr-space {
            border: 1px solid #000;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
        }

        .status-paid {
            color: #28a745;
            font-weight: bold;
        }

        .status-unpaid {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="header">
        <table style="width: 100%; padding-bottom: 15px;">
            <tr>
                <td style="width: 70%; vertical-align: middle;">
                    <img src="{{ public_path('images/logo.png') }}" alt="Tax Learning System" style="width: 160px;">
                </td>
                <td style="width: 30%; text-align: right; vertical-align: middle;" class="billing-code">
                    <p>Kode Billing</p>
                    <p><strong>{{ $billings->first()->code }}</strong></p>
                </td>
            </tr>
        </table>
    </div>

    <div class="personal-data">
        <table>
            <tr>
                <td class="label">NPWP</td>
                <td>: {{ $user->npwp }}</td>
            </tr>
            <tr>
                <td class="label">NAMA</td>
                <td>: {{ $user->name }}</td>
            </tr>
            <tr>
                <td class="label">ALAMAT</td>
                <td>: {{ $user->address ?? 'N/A' }}</td>
            </tr>
            <br>
            <tr>
                <td class="label">MATA UANG</td>
                <td>: {{ $currency }}</td>
            </tr>
            <tr>
                <td class="label">TOTAL NOMINAL</td>
                <td>: {{ number_format($total_amount, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="label">JUMLAH BILLING</td>
                <td>: {{ $billing_count }}</td>
            </tr>
        </table>
    </div>

    <div class="billing-details">
        <p><strong>DETAIL BILLING : </strong></p>
        <table>
            <thead>
                <tr>
                    <th>NO</th>
                    <th>KAP-KJS</th>
                    <th>MASA PAJAK</th>
                    <th>REF TAGIHAN</th>
                    <th>NOP</th>
                    <th>NOMINAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($billings as $index => $billing_item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $billing_item->billingType->code ?? 'N/A' }}</td>
                        <td>
                            @php
                                $monthNames = [
                                    'januari' => '01',
                                    'februari' => '02',
                                    'maret' => '03',
                                    'april' => '04',
                                    'mei' => '05',
                                    'juni' => '06',
                                    'juli' => '07',
                                    'agustus' => '08',
                                    'september' => '09',
                                    'oktober' => '10',
                                    'november' => '11',
                                    'desember' => '12',
                                ];

                                // Ambil start_period dan end_period
                                $startPeriod = strtolower($billing_item->start_period);
                                $endPeriod = strtolower($billing_item->end_period);
                                $year = $billing_item->year;

                                // Konversi start_period ke format MM
                                $startMonth = '01';
                                if (is_numeric($startPeriod)) {
                                    $startMonth = str_pad($startPeriod, 2, '0', STR_PAD_LEFT);
                                } elseif (array_key_exists($startPeriod, $monthNames)) {
                                    $startMonth = $monthNames[$startPeriod];
                                }

                                // Konversi end_period ke format MM
                                $endMonth = '01';
                                if (is_numeric($endPeriod)) {
                                    $endMonth = str_pad($endPeriod, 2, '0', STR_PAD_LEFT);
                                } elseif (array_key_exists($endPeriod, $monthNames)) {
                                    $endMonth = $monthNames[$endPeriod];
                                }

                                // Format: MMDDYYYY (start_month + end_month + year)
                                $formattedPeriod = $startMonth . $endMonth . $year;
                            @endphp

                            @if (strpos($billing_item->billingType->code ?? '', '411618-100') !== false)
                                0112{{ $billing_item->year }}
                            @elseif (strpos($billing_item->billingType->code ?? '', '411211-100') !== false)
                                {{ $formattedPeriod }}
                            @else
                                {{ $formattedPeriod }}
                            @endif
                        </td>
                        <td>-</td>
                        <td>-</td>
                        <td>{{ number_format($billing_item->amount, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <th colspan="5">TOTAL</th>
                    <th>{{ number_format($total_amount, 0, ',', '.') }}</th>
                </tr>
                <tr class="amount-in-words">
                    <td colspan="6">Terbilang: {{ $billings->first()->amount_in_words ?? 'N/A' }}</td>
                </tr>
            </tbody>
        </table>
        <p><strong>URAIAN : SPT Masa periode {{ $start_period }} {{ $year }}</strong></p>
    </div>

    <div class="footer-section">
        <p>GUNAKAN KODE BILLING DIBAWAH INI UNTUK MELAKUKAN PEMBAYARAN:</p>

        <div class="footer-container">
            <div class="expiry-info">
                <p class="label">BILLING GROUP ID : {{ $billing_form_id }}</p>
                <p class="label">MASA AKTIF : {{ $active_period }}</p>
                <p class="label">JUMLAH BILLING : {{ $billing_count }}</p>
                <p class="label">TOTAL NOMINAL : {{ number_format($total_amount, 0, ',', '.') }}</p>
                <p class="label">KODE BILLING : {{ $billings->first()->code }}</p>
            </div>
        </div>
    </div>

</body>

</html>
