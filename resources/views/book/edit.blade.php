
@extends('layouts.layout')

@section('content')

<?php $url = request()->fullUrl(); ?>

<div class="container">
    <div class="row">
        <div class="col-2">

            @if($user->image)
                <img class="img-fluid" src="{{$user->image}}" alt="user-image">
            @else
                <img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-image">
            @endif

        </div>
        <div class="col-10">
            <p class="h4">{{$user->name}}</p>
            <p class="h5">{{'@' . $user->str_id}}</p>
        </div>
    </div>

    @if ($books->isEmpty()) 
        <p class="text-danger mt-5">本が見つかりません</p>
    @else

    <div class="row book-shelf">
        <div class="col-12">
            <form action="{{$url}}" method="POST">
                @csrf
                @foreach($genres_books as $genre_id => $books)
                    <label for="{{$genre_id}}">
                        <input class="h2 mt-2 genres" name="{{$genre_id}}" value={{$genres[$genre_id]}} required>
                    </label>
                    @foreach($books->chunk(4) as $chunk)
                        <div class="row mt-3">
                            @foreach($chunk as $book)
                                <?php $book_url = '/book/' . $book->isbn ?>
                                <div class="col-3">
                                    <a href="{{$book_url}}">
                                        @if (isset($book->cover))
                                            <img class="img-fluid w-100" src="{{$book->cover}}" alt="book-cover">
                                        @else
                                            <img class="img-fluid w-100" src="{{asset('img/book.svg')}}" alt="book-cover">
                                        @endif
                                    </a>
                                </div>
                            @endforeach
                        </div>
                        <div class="row mt-2">
                            @foreach($chunk as $book)
                            <div class="col-3">
                                <p>{{$book->title}}</p>
                            </div>
                            @endforeach
                        </div>
                    @endforeach
                @endforeach
                <button type="submit" class="btn btn-outline-success">ジャンルを編集する</button>
            </form>
        </div>
    </div>
    @endif
</div>

@endsection