@extends('layouts.layout')

@section('content')

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
               {{--
               <div>
                    <a href="/book/add">
                        <button type="button" class="btn btn-outline-success">本棚に追加する</button>
                    </a>
                </div>
                --}}
                <form action="{{request()->fullUrl()}}" method="POST">
                    @csrf
                    <input type="hidden" name="isbn" value="{{$book->isbn}}">
                    <input type="submit" class="btn btn-outline-success" value="本の投稿をする">
                </form>
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
        <form action="/book" method="POST">
            @csrf
            <label for="isbn">ISBN (13桁)</label>
            <input type="text" id="isbn" name="isbn">
            <input type="submit" value="検索">
        </form>
        <p>test</p>
        <p>9784297100339 Docker/Kubernetes実践コンテナ開発入門</p>
        <p>9784839955557 ノンデザイナーズ・デザインブック</p>
    @endif
</div>

@endsection