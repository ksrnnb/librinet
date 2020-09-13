
@extends('layouts.layout')

@section('content')
{{-- <div id="post-react"></div> --}}

<div class="container">
    <div class="row">
        <a href="/book" class="h3">本を検索する</a>
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

</div>
{{-- <script src="{{asset('js/app.js')}}"></script> --}}

@endsection('content')