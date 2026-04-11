<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Halaman Tidak Ditemukan</title>
    <style>
        :root {
            color-scheme: light dark;
        }

        body {
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .wrap {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .card {
            width: 100%;
            max-width: 560px;
            border: 1px solid rgba(127, 127, 127, .25);
            border-radius: 14px;
            padding: 24px;
        }

        .code {
            font-size: 14px;
            opacity: .75;
            letter-spacing: .12em;
            text-transform: uppercase;
        }

        h1 {
            margin: 10px 0 8px;
            font-size: 24px;
        }

        p {
            margin: 0 0 18px;
            line-height: 1.5;
            opacity: .85;
        }

        .actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        a.btn {
            display: inline-block;
            padding: 10px 14px;
            border-radius: 10px;
            text-decoration: none;
            border: 1px solid rgba(127, 127, 127, .35);
            background: #fff;
            color: #000;
        }

        a.btn:visited {
            color: #000;
        }

        a.primary {
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="wrap">
        <main class="card" role="main">
            <div class="code">404</div>
            <h1>Halaman tidak ditemukan</h1>
            <p>Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>

            <div class="actions">
                <a class="btn primary" href="{{ url('/') }}">Kembali ke Beranda</a>
                <a class="btn" href="{{ url()->previous() }}">Kembali</a>
            </div>
        </main>
    </div>
</body>

</html>
