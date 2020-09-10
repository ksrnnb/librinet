<!-- $user: Eloquent collection (root parameter is str_id: yLhfXC) -->

@extends('layouts.layout')

@section('content')
{{-- <div id="user-react"></div> --}}

<div class="container">
    <div class="row">
        <div class="col-2">
            @if(isset($user->image))
                <img class="img-fluid" src="{{$user->image}}" alt="user-image">
            @else
                <img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-image">
            @endif
        </div>
        <div class="col-10">
            <p class="h4">{{$user->name}}</p>
            <p class="d-inline">{{'@' . $user->str_id}}</p>
        </div>
    </div>

    <div class="row book-shelf">
        <div class="col-12">
            @if(isset($genres_books_collection))
                @foreach($genres_books_collection as $genre_id => $books)
                    <p class="h2 mt-2">{{$genres[$genre_id]}}</p>
                    @foreach($books->chunk(4) as $chunk)
                        <div class="row mt-3">
                            @foreach($chunk as $book)
                                <div class="col-3">
                                    <img class="img-fluid w-100" src="{{$book->cover}}" alt="book-cover">
                                </div>
                            @endforeach
                        </div>
                        <div class="row mt-2">
                            <!-- ウィンドウ幅多い聞いときにタイトルがはみ出る。。。 -->
                            @foreach($chunk as $book)
                            <div class="col-3">
                                <p>{{$book->title}}</p>
                            </div>
                            @endforeach
                        </div>
                    @endforeach
                @endforeach
            @endif
        </div>
    </div>
</div>

{{--
<script src="{{asset('js/app.js')}}"></script>
--}}
@endsection