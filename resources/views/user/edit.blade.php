
@extends('layouts.layout')

@section('content')

<?php $url = request()->fullUrl(); ?>
<?php $auth_id = Auth::id(); ?>

<div class="container">
    <div class="row">
        <div class="col-2">

            <!-- TODO: ユーザーの画像も編集できるようにしたい -->
            @if($user->image)
                <img class="img-fluid" src="{{$user->image}}" alt="user-image">
            @else
                <img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-image">
            @endif

        </div>
        <div class="col-10">
            <div>

                <form action="{{$url}}" method="POST">
                    @csrf
                    <label for="name" class="d-block">
                        <p>ユーザー名</p>
                        @if ($errors->has('name'))
                            <!-- エラーメッセージ -->
                            @foreach($errors->get('name') as $error)
                                <p class="text-danger">{{$error}}</p>
                            @endforeach
                        @endif
                        @if (old('name'))
                            <input class="h4" id="name" name="name" value="{{old('name')}}" required>
                        @else
                            <input class="h4" id="name" name="name" value="{{$user->name}}" required>
                        @endif
                    </label>
                    <label for="str_id" class="d-block">
                        <p>ユーザーID</p>
                        @if ($errors->has('str_id'))
                            <!-- エラーメッセージ -->
                            @foreach($errors->get('str_id') as $error)
                                <p class="text-danger">{{$error}}</p>
                            @endforeach
                        @endif
                        @if (old('name'))
                            <input class="h4" id="str_id" name="str_id" value="{{old('str_id')}}" required>
                        @else
                            <input class="h4" id="str_id" name="str_id" value="{{$user->str_id}}" required>
                        @endif
                    </label>

                    <input type="submit" class="btn btn-outline-success" value="編集する">
                </form>
            </div>

            <div class="mt-5">
                <a href="/password/reset">
                    <button type="button" class="btn btn-outline-info">パスワードを再設定する</button>
                </a>
            </div>
            <div class="mt-5">
                <form action="{{'/user/delete/' . $user->str_id}}" method="POST">
                    @csrf
                    <input type="submit" class="btn btn-outline-danger" value="アカウントを削除する"></button>
                </form>
                </a>
            </div>
        </div>
    </div>

    
</div>

@endsection