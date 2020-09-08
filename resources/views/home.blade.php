
@extends('layouts.layout')

@section('content')
<!-- <div id="post-react"></div> -->

<!-- TODO: Eager修正する。 -->
<div class="container">
    @foreach($posts as $post)
        <!-- 全部のPostをとってきてるから、ユーザーが入ってないときは処理しないようにする -->
        @isset($post->user)
            <div class="post" style="border: solid 1px blue">
                <img src="{{$post->book->cover}}" alt="book_image">
                <h2>{{$post->user->id}}</h2>
                <p>{{$post->user->name}}</p>
                <p>{{$post->message}}</p>
            </div>
        @endisset

        @isset($post->comments)
            @foreach($post->comments as $comment)
                <div class="comment" style="border: solid 1px black">
                    <h2>これはコメント</h2>
                    @isset($comment->book)
                        <img src="{{$comment->book->cover}}" alt="book_image">
                    @endisset
                    <p>{{$comment->user->name}}</p>
                    <p class="h4">{{$comment->message}}</p>
                </div>
            @endforeach
        @endisset
    @endforeach

</div>
<!-- <script src="{{asset('js/app.js')}}"></script> -->
@endsection('content')


{{-- @extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

--}}
