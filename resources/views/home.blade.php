
@extends('layouts.layout')

@section('content')
{{-- <div id="post-react"></div> --}}

<div class="container">
    @foreach($posts as $post)
        {{--  全部のPostをとってきてるから、ユーザーが入ってないときは処理しないようにする --}}
        @isset($post->user)
            <div class="row">
                <div class="post col-12" style="border: solid 1px blue">
                    <div class="row pt-2">
                        <figure class="col-2 mb-0">
                            <img class="img-fluid" src="{{$post->book->cover}}" alt="book_image">
                        </figure>
                        <div class="user col-10">
                            <div class="row">
                                <div class="avator col-2">
                                    @if(isset($post->user->image))
                                        {{-- TODO: ユーザー画像登録したら本当に表示されるか、確認する --}}
                                        <img class="img-fluid" src="{{$post->user->image}}" alt="user-icon">
                                    @else
                                        <a href="{{'/user/' . $post->user->str_id}}"><img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-icon"></a>
                                    @endif
                                </div>
                                <div class="col-10">
                                    <p class="h4 d-inline mr-1">{{$post->user->name}}</p>
                                    <p class="d-inline">{{' @' . $post->user->str_id}}</p>
                                    <p>{{$post->message}}</p>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                    <p class="book-title my-2">{{$post->book->title}} （ {{$post->book->author}} ）</p>

                </div>
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
{{-- <script src="{{asset('js/app.js')}}"></script> --}}

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
