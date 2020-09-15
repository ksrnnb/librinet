@extends('layouts.layout')

@section('content')
<div class="container">

    @guest
        <div class="row">
            <form action="/" method="POST">
                @csrf
                <button type="submit" id="guest" class="btn">
                    ゲストでログイン
                </button>
            </form>
        </div>
        <a class="nav-link" href="{{ route('login') }}">ログイン</a>
        @if (Route::has('register'))
            <a class="nav-link" href="{{ route('register') }}">ユーザー登録</a>
        @endif
    @endguest
</div>
@endsection