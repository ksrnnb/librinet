
@extends('layouts.layout')

@section('content')
{{-- <div id="post-react"></div> --}}

<div class="container">
    @foreach($posts as $post)
        {{--  全部のPostをとってきてるから、ユーザーが入ってないときは処理しないようにしている --}}
        @isset($post->user)
            @include('components.feed', ['item' => $post])
        @endisset

        @isset($post->comments)
            @foreach($post->comments as $comment)
                @include('components.feed', ['item' => $comment])
            @endforeach
        @endisset
    @endforeach

</div>
{{-- <script src="{{asset('js/app.js')}}"></script> --}}

@endsection('content')