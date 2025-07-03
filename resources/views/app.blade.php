<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        <div id="app">
        {{-- Your React app will be mounted here --}}
    </div>
    </body>
    <script >
     window.addEventListener("online", () => console.log("🟢 Online global test"));

    </script>
</html>
