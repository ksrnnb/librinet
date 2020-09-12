@extends('layouts.layout')

@section('content')
<div class="container">    
    <form action="{{request()->fullUrl()}}" method="POST">
        @csrf
        <div class="row">
            <div class="col-12">
                <h2>投稿画面</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h4>本棚</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                @if ($book->isInBookshelf)
                    <label for="add" style="opacity:0.5">
                        <input type="checkbox" name="add" id="add" value=0 disabled>
                        本棚に追加
                    </label>
                @else
                    <label for="add">
                        <input type="checkbox" name="add" id="add" value=1 checked>
                        本棚に追加
                    </label>
                @endif
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <!-- TODO: そもそも本棚に追加ボタンが有効でない場合は表示しない。 -->
                <h4>ジャンルの選択</h4>
                <div class="row">
                    <div class="col-12">
                        <label for="new">
                            <!-- radio buttonでnameは共通に！ -->
                            <input type="radio" name="genre" id="new">
                            新しいジャンルを入力
                        </label>
                    </div>
                </div>
                <!-- TODO: 選択されてない時は灰色 or 透明色に -->
                <div class="row">
                    <div class="col-12">
                        <label for="new_genre">
                            <input type="text" name="new_genre">
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <label for="conventional">
                            <input type="radio" name="genre" id="conventional">
                            既存のジャンルから選択
                        </label>
                    </div>
                </div>
                <!-- TODO: 選択されてない時は灰色 or 透明色に -->
                <div class="row">
                    <div class="col-12">
                        <select name="genre">
                            @foreach($genres as $id => $genre)
                                <option value="{{$id}}">{{$genre}}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h4>本の情報</h4>
            </div>
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
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <h4>投稿コメント</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <textarea name="message" id="" cols="30" rows="10"></textarea>
                    <!-- 本の情報 -->
                <input type="hidden" name="title" value="{{$book->title}}">
                <input type="hidden" name="author" value="{{$book->author}}">
                <input type="hidden" name="cover" value="{{$book->cover}}">
                <input type="hidden" name="publisher" value="{{$book->publisher}}">
                <input type="hidden" name="pubdate" value="{{$book->pubdate}}">
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <input type="submit" value="投稿する">
            </div>
        </div>
    
    </form>
    
</div>
@endsection