<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
    <title>{{ config('app.name') }}</title>
</head>
<body>
    <header>

        <nav class="navbar fixed-top bg-success">
        <a class="navbar-brand" href="/home">{{ config('app.name') }}</a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#">ホーム</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">本を検索する</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">ユーザーを検索する</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">プロフィール</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">ログアウト</a>
            </li>
            
            </ul>


        <!-- <a class="dropdown" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="/home">ホーム</a>
            <a class="dropdown-item" href="/book">本を検索する</a>
            <a class="dropdown-item" href="/user/search">ユーザーを検索する</a>
        </div> -->
    
        </nav>

    </header>

    <main class="pt-5">
        @yield('content')
    </main>
    </body>
    <script src="{{asset('js/app.js')}}"></script>
</html>