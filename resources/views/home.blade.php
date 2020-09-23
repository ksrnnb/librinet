
@extends('layouts.layout')

@section('content')
{{-- <div id="post-react"></div> --}}

<div class="container">
    <div class="row">
        <div class="col-12">
            <h3>
                <a href="/book">本を検索する</a>
            </h3>
            <h3>
                <a href="/user/search">ユーザーを検索する
            </h3>
        </div>
    </div>
    @foreach($posts as $post)
        {{--  全部のPostをとってきてるから、ユーザーが入ってないときは処理しないようにしている --}}
        @isset($post->user)
            @include('components.feed', ['item' => $post])
            
            @isset($post->comments)
                @foreach($post->comments as $comment)
                    @include('components.feed', ['item' => $comment])
                @endforeach
            @endisset
            
        @endisset
    @endforeach
<div id="like-react"></div>
</div>

@endsection('content')