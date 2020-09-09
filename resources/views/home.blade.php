
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
                        <div class="col-2 px-0">
                            @if(isset($post->book))
                                <figure class="mx-2 px-0 mb-0 book">
                                    {{--TODO: 本の画像を押したら、本の詳細を表示して本棚に入れるかどうかのページへ--}}
                                    @if(isset($post->book->cover))
                                        <img class="img-fluid" src="{{$post->book->cover}}" alt="book_image">
                                    @else
                                        <img class="img-fluid" src="{{asset('img/book.svg')}}" alt="book_image">
                                    @endif
                                </figure>
                            @else
                                <div class="mx-2"></div>
                            @endif
                        </div>
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
                    @if(isset($post->book))
                        <p class="book-title my-2">{{$post->book->title}} （ {{$post->book->author}} ）</p>
                    @else
                        <p class="book-title my-2"></p>
                    @endif
                </div>
            </div>
        @endisset

        {{--TODO: postとcommentが入れ替わっただけでやっていることは一緒。うまく整理できないか？--}}
        @isset($post->comments)
            @foreach($post->comments as $comment)
            <div class="row">
                <div class="comment col-12" style="border: solid 1px blue">
                    <div class="row pt-2">
                        <div class="col-2 px-0">
                            @if(isset($comment->book))
                                <figure class="mx-2 px-0 mb-0 book">
                                    {{--TODO: 本の画像を押したら、本の詳細を表示するページへ--}}
                                    @if(isset($comment->book->cover))
                                        <img class="img-fluid" src="{{$comment->book->cover}}" alt="book_image">
                                    @else
                                        <img class="img-fluid" src="{{asset('img/book.svg')}}" alt="book_image">
                                    @endif
                                </figure>
                            @else
                                <div class="mx-2"></div>
                            @endif
                        </div>
                        <div class="user col-10">
                            <div class="row">
                                <div class="avator col-2">
                                    @if(isset($comment->user->image))
                                        {{-- TODO: ユーザー画像登録したら本当に表示されるか、確認する --}}
                                        <img class="img-fluid" src="{{$comment->user->image}}" alt="user-icon">
                                    @else
                                        <a href="{{'/user/' . $comment->user->str_id}}"><img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-icon"></a>
                                    @endif
                                </div>
                                <div class="col-10">
                                    <p class="h4 d-inline mr-1">{{$comment->user->name}}</p>
                                    <p class="d-inline">{{' @' . $comment->user->str_id}}</p>
                                    <p>{{$comment->message}}</p>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                    @if(isset($comment->book))
                        <p class="book-title my-2">{{$comment->book->title}} （ {{$comment->book->author}} ）</p>
                    @else
                        <p class="book-title my-2"></p>
                    @endif

                </div>
            </div>
            @endforeach
        @endisset
    @endforeach

</div>
{{-- <script src="{{asset('js/app.js')}}"></script> --}}

@endsection('content')