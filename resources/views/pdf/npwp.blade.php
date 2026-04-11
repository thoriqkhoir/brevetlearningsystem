<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NPWP - {{ $taxpayer->name }}</title>
    <style>
        @page {
            size: A4;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            background: url('{{ public_path("images/template-npwp.png") }}') no-repeat top center;
            background-size: cover;
        }

        .npwp-card {
            display: inline-block;
            width: 76mm;
            height: 45mm;
            border-radius: 8px;
            padding: 8px;
            margin: 28px 15px;
            background-size: cover;
            position: relative;
            box-sizing: border-box;
            vertical-align: top;
        }

        .npwp-rear {
            display: inline-block;
            width: 74mm;
            height: 45mm;
            border-radius: 8px;
            padding: 8px;
            margin: 28px 0 0 42px;
            background-size: cover;
            position: relative;
            box-sizing: border-box;
            vertical-align: top;
        }

        .card-header {
            position: absolute;
            top: 14px;
            right: 8px;
        }

        .office-name {
            font-size: 7px;
            font-weight: bold;
        }

        .npwp-number {
            font-size: 26px;
            font-weight: bold;
            margin: 54px 0 0 10px;
            letter-spacing: 1px;
        }

        .taxpayer-name {
            font-size: 8px;
            font-weight: bold;
            margin: 2px 10px;
            text-transform: uppercase;
        }

        .qr-section {
            position: absolute;
            bottom: 10px;
            left: 18px;
            width: 11mm;
            height: 11mm;
            border: 1px solid #ddd;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6px;
            color: #666;
        }

        .address-section {
            position: absolute;
            top: 132px;
            left: 72px;
            margin-right: 10px;
            font-size: 7px;
            font-weight: bold;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .registration-date {
            position: absolute;
            bottom: 10px;
            left: 72px;
            margin-top: 10px;
            font-size: 7px;
            font-weight: bold;
        }

        .logo {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }

        .web-name {
            font-size: 8px;
            font-weight: bold;
            color: white;
            margin: 10px 0 0 10px;
        }

        .tagline {
            position: absolute;
            top: 12px;
            right: 10px;
            font-size: 8px;
            color: white;
        }

        .logo-rear {
            position: absolute;
            bottom: 14px;
            left: 24px;
        }

        .text-rear {
            position: absolute;
            bottom: 5px;
            left: 78px;
            right: 10px;
            font-size: 5px;
            color: white;
        }
    </style>
</head>

<body>
    <div class="npwp-card">
        <div class="card-header">
            <div class="office-name">KANTOR PELAYANAN PAJAK BIINSPIRA</div>
        </div>

        <div class="npwp-number">
            @php
            $npwp = $taxpayer->npwp ?? $taxpayer->npwp_number ?? '';
            $formatted = '';
            if (strlen($npwp) == 16) {
            $formatted = substr($npwp, 0, 4) . ' ' .
            substr($npwp, 4, 4) . ' ' .
            substr($npwp, 8, 4) . ' ' .
            substr($npwp, 12, 4);
            } else {
            $formatted = $npwp;
            }
            @endphp
            {{ $formatted }}
        </div>

        <div class="taxpayer-name">
            {{ strtoupper($taxpayer->name) }}
        </div>

        {{-- <div class="qr-section">
            <div style="text-align: center;">
                <div style="width: 11mm; height: 11mm; background: #f0f0f0; margin-bottom: 1mm;"></div>
            </div>
        </div> --}}

        @if($qrCode)
        <div class="qr-section">
            @if(str_contains($qrCode, 'image/png'))
            <img src="{{ $qrCode }}" alt="QR Code" style="width: 11mm; height: 11mm; object-fit: contain;">
            @else
            {!! $qrCode !!}
            @endif
        </div>
        @else
        <div class="qr-placeholder">
            QR Code<br>Not Available
        </div>
        @endif

        @if($taxpayer->addresses && count($taxpayer->addresses) > 0)
        @php
        $mainAddress = collect($taxpayer->addresses)->firstWhere('address_type', 'Alamat Domisili (Alamat Utama)')
        ??
        $taxpayer->addresses[0];
        @endphp
        <div class="address-section">
            {{ $mainAddress->address_detail ?? '' }}
            RT. {{ $mainAddress->rt ?? '' }}, RW. {{ $mainAddress->rw ?? '' }}, {{ $mainAddress->sub_district ?? ''
            }}
            {{ $mainAddress->district ?? '' }}, {{ $mainAddress->region ?? '' }},
            {{ $mainAddress->province ?? '' }}, {{ $mainAddress->post_code ?? '' }}
        </div>
        @endif

        <div class="registration-date">
            TANGGAL TERDAFTAR
            {{ \Carbon\Carbon::parse($taxpayer->created_at)->format('d/m/Y') }}
        </div>

        <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="width: 30px;" class="logo">
    </div>

    <div class=" npwp-rear">
        <h1 class="web-name">taxlearning.id</h1>
        <h2 class="tagline">Pajak Kita Untuk Kita</h2>

        <img src="{{ public_path('images/logo putih.png') }}" alt="Logo" style="width: 42px;" class="logo-rear">

        <p class="text-rear">
            Kartu ini harap disimpan baik-baik dan apabila hilang, agar segera melapor ke Kantor Pelayanan Pajak
            terdaftar <br>
            NPWP agar dicantumkan dalam hal berhubungan dengan dokumen perpajakan <br>
            Dalam hal Wajib Pajak pindah domisili, supaya melaporkan diri ke Kantor Pelayanan Pajak lama atau Kantor
            Pelayanan Pajak baru. <br>
            Seluruh layanan perpajakan tidak dipungut biaya <br>
        </p>
    </div>
</body>

</html>