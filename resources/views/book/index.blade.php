@extends('layouts.layout')

@section('content')
<?php $url = request()->fullUrl(); ?>
<div class="container">
    @if(isset($book))
        <p class="h2">本の情報</p>
        <div class="row">
            <div class="col-3">
                <figure class="mx-2 px-0 mb-0 book">
                    @if($book->cover)
                        <img class="img-fluid" src="{{$book->cover}}" alt="book_image">
                    @else
                        <img class="img-fluid" src="{{asset('img/book.svg')}}" alt="book_image">
                    @endif
                </figure>
            </div>
            <div class="col-9">
                <p>タイトル： {{$book->title}}</p>
                <p>著者：{{$book->author}}</p>
                <p>出版社：{{$book->publisher}}</p>
                <?php $pub_year = substr($book->pubdate, 0, 4) . '年'?>
                <p>出版年：{{$pub_year}}</p>
                <a href="{{'/book/post/' . $book->isbn}}">
                    <button type="button" class="btn btn-outline-success">本の投稿をする</button>
                </a>

                @if ($isNotInBookshelf)
                    <a href="{{'/book/add/' . $book->isbn}}">
                        <button type="button" class="btn btn-outline-success">本棚に追加する</button>
                    </a>
                @endif
                <div>
                    <a href="/book">
                        <button type="button" class="btn btn-outline-success">本の検索画面に戻る</button>
                    </a>
                </div>
            </div>
        </div>
        <div class="row mt-2">
                
        </div>
    @else
        <h2>本の検索</h2>
        <!-- <form action="/book" method="POST"> -->
            {{--@csrf--}}
            <div>
                <label for="isbn">
                    <h3 class="mb-0">ISBN (13桁*)</h3>
                </label>
            </div>
            <!-- validation -->
            @if ($errors->all())
                @foreach ($errors->all() as $error)
                    <p class='error mb-0'>{{$error}}</p>
                @endforeach
            @endif
            @if (isset($cannot_fetch_message))
                <p class='error mb-0'>{{$cannot_fetch_message}}</p>
            @endif
            <div id="book-react">
                <!-- 検索フォーム -->

            </div>
        <!-- </form> -->

    @endif
</div>

@endsection