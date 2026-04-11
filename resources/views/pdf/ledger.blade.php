<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taxpayer Ledger Transcript</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }

        .header {
            text-align: center;
        }

        .logo {
            width: 150px;
        }

        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            width: 100%;
        }

        .info-section {
            margin-bottom: 12px;
        }

        .info-item {
            width: 180px;
        }

        .info-row {
            display: flex;
            margin-bottom: 5px;
        }

        .filter-section {
            margin-bottom: 12px;
        }

        .filter-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .filter-row {
            display: flex;
            margin-bottom: 5px;
        }

        .filter-label {
            width: 120px;
        }

        .filter-value {
            flex: 1;
        }

        .currency-note {
            font-style: italic;
            margin: 15px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .info-section td {
            border: none;
            text-align: left;
        }

        .filter-section td {
            border: none;
            text-align: left;
        }

        .ledger-details th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .total-row {
            font-weight: bold;
        }

        .currency {
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" alt="Tax Learning System" style="width: 160px;">
    </div>

    <div class="info-section">
        <h1 class="title">TAXPAYER LEDGER TRANSCRIPT</h1>

        <table>
            <tr>
                <td class="info-item">Taxpayer Name</td>
                <td>: {{ $user->name }}</td>
            </tr>
            <tr>
                <td class="info-item">Taxpayer Identification Number</td>
                <td>: {{ $user->npwp }}</td>
            </tr>
            <tr>
                <td class="info-item">Date Generated</td>
                <td>: {{ $date }}</td>
            </tr>
        </table>
    </div>

    <div class="filter-section">
        <table>
            <tr>
                <td class="info-item">Transaction Date From</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Transaction Date To</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Accounting Type</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Accounting Type Detail</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Is Cancelled</td>
                <td>: NO</td>
            </tr>
            <tr>
                <td class="info-item">Revenue Code</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Tax Period From</td>
                <td>: -</td>
            </tr>
            <tr>
                <td class="info-item">Tax Period To</td>
                <td>: -</td>
            </tr>
        </table>
    </div>

    <div class="currency-note">
        All transactions included in this transcript are stated in Indonesian Rupiah (IDR) currency
    </div>

    <div class="ledger-details">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Transaction number</th>
                    <th>Debit amount</th>
                    <th>Debit unpaid</th>
                    <th>Credit amount</th>
                    <th>Credit left</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($ledgers as $index => $ledger)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $ledger->transaction_number }}</td>
                    <td class="currency">{{ number_format($ledger->debit_amount, 0, ',', '.') }}</td>
                    <td class="currency">{{ number_format($ledger->debit_unpaid, 0, ',', '.') }}</td>
                    <td class="currency">{{ number_format($ledger->credit_amount, 0, ',', '.') }}</td>
                    <td class="currency">{{ number_format($ledger->credit_left, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Balance</th>
                    <th>Debit Unpaid</th>
                    <th>Credit Left</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="total-row">Total</td>
                    <td>{{ number_format($totalCreditLeft - $totalDebitUnpaid, 0, ',', '.') }}</td>
                    <td>{{ number_format($totalDebitUnpaid, 0, ',', '.') }}</td>
                    <td>{{ number_format($totalCreditLeft, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td class="total-row">Total Filtered</td>
                    <td>{{ number_format($totalCreditLeft - $totalDebitUnpaid, 0, ',', '.') }}</td>
                    <td>{{ number_format($totalDebitUnpaid, 0, ',', '.') }}</td>
                    <td>{{ number_format($totalCreditLeft, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>