
@extends('layouts.layout')

@section('content')

<div class="container">

    <div class="row">
        <div class="col-12">

            @if (empty($users))
                <h2>ユーザーの検索</h2>
                <form action="/user/search" method="POST">
                    @csrf
                    <div>
                        <label for="isbn">
                            <h3 class="mb-0">ユーザーID or ユーザー名</h3>
                        </label>
                    </div>
                    <!-- validation -->
                    @if ($errors->all())
                        @foreach ($errors->all() as $error)
                            <p class='error mb-0'>{{$error}}</p>
                        @endforeach
                    @endif
                    <div>
                        <input type="text" id="user" name="user" required>
                        <input type="submit" value="検索">
                    </div>
                </form>
                <p class="mt-5">例</p>
                <?php   $user1 = App\User::find(1);
                        $user2 = App\User::find(2); ?>

                <p>{{$user1->str_id}} {{$user1->name}}</p>
                <p>{{$user2->str_id}} {{$user2->name}}</p>
            @else

                <h2>検索結果</h2>
                @foreach ($users as $user)
                    @include('components.user', ['user' => $user])
                @endforeach

            @endif
        </div>
    </div>
</div>
@endsection('content')