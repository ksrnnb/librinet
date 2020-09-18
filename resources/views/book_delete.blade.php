
@extends('layouts.layout')

@section('content')

<?php $url = request()->fullUrl(); ?>

<div class="container">
<!-- TODO：サブビューにする？　ユーザー部分 -->
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
        <form action="{{$url}}" method="POST">
            @csrf
            <div class="row">
                <div class="col-9">
                </div>
                <!-- TODO：右寄せ？ -->
                <div class="col-3">
                    <button type="submit" class="btn btn-outline-danger">選択した本を削除する</button>
                </div>
            </div>

            @foreach($genres_books as $genre_id => $books)
                <p class="h2 mt-5">{{$genres[$genre_id]}}</p>
                @foreach ($books as $book)
                    @if ($book->isInBookshelf)
                        <div class="row mb-5">
                            <div class="item col-12" style="border: solid 1px blue">
                                <div class="row pt-2">
                                    <div class="col-1">
                                        <input type="checkbox" name="{{$book->id}}" class="books">
                                    </div>
                                    <div class="col-2 px-0">
                                        <?php $book_url = '/book/' . $book->isbn ?>
                                        <figure class="mx-2 px-0 mb-0 book">
                                            <a href="{{$book_url}}">
                                            @if($book->cover)
                                                <img class="img-fluid" src="{{$book->cover}}" alt="book_image">
                                            @else
                                                <img class="img-fluid" src="{{asset('img/book.svg')}}" alt="book_image">
                                            @endif
                                            </a>
                                        </figure>

                                        <div class="mx-2"></div>
                                    </div>

                                    <div class="col-9">
                                        <p class="h4">{{$book->title}}</p>
                                        <p class="h4">{{$book->author}}</p>
                                        <p class="h4">{{$book->publisher}}</p>
                                        <p class="h4">{{$book->pubdate}}</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    @endif
                @endforeach
            @endforeach
            <div class="row">
                <div class="col-9">
                </div>
                <!-- TODO：右寄せ？ -->
                <div class="col-3">
                    <button type="submit" class="btn btn-outline-danger">選択した本を削除する</button>
                </div>
            </div>
        </form>
    @endif
</div>

@endsection