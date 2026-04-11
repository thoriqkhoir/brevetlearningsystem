<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Tax Learning System') }}</title>

    <meta name="description"
        content="Tax Learning System adalah platform pembelajaran pajak untuk membantu dalam memahami dan mengelola pajak dengan mudah dan efisien.">
    <meta name="keywords"
        content="Tax Learning System, pembelajaran pajak, manajemen pajak, sistem pajak, belajar pajak online">
    <meta name="author" content="Aksara Teknologi Mandiri">
    <meta name="robots" content="index, follow">

    <meta property="og:title" content="Tax Learning System">
    <meta property="og:description"
        content="Platform pembelajaran pajak untuk membantu dalam memahami dan mengelola pajak dengan mudah dan efisien.">
    <meta property="og:image" content="{{ asset('images/logo.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>