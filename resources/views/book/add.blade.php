@extends('layouts.layout')

@section('content')
<div class="container">
    <form action="{{request()->fullUrl()}}" method="POST">
        @csrf
        <!-- 本の情報 -->
        <input type="hidden" name="title" value="{{$book->isbn}}">
        <input type="hidden" name="title" value="{{$book->title}}">
        <input type="hidden" name="author" value="{{$book->author}}">
        <input type="hidden" name="cover" value="{{$book->cover}}">
        <input type="hidden" name="publisher" value="{{$book->publisher}}">
        <input type="hidden" name="pubdate" value="{{$book->pubdate}}">

        <div class="row">
            <div class="col-12">
                <h2>本棚に追加する</h2>
            </div>
        </div>

        @if ($errors->all())
            @foreach ($errors->all() as $error)
                <p class="text-danger">{{$error}}</p>
            @endforeach
        @endif
        
        <div id="genre-container">
            <div class="row">
                <div class="col-12">
                    <h4>ジャンルの選択</h4>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <label for="new">
                        <!-- radio buttonでnameは共通に！ -->
                        <input type="radio" name="genre" id="new" value="new" checked>
                        新しいジャンルを入力
                    </label>
                </div>
            </div>            
            <div class="row">
                <div class="col-12">
                    <label for="new_genre">
                    {{-- book_postのほうはrequiredになってない / JavaScriptで制御してる？ --}}
                        <input type="text" name="new_genre" id="new-input" required>
                    </label>
                </div>
            </div>
            @if(empty($genres))

            @else
            <div class="row">
                <div class="col-12">
                    <label for="conventional">
                        <input type="radio" name="genre" id="conventional" value="conventional">
                        既存のジャンルから選択
                    </label>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <select name="genre_id" disabled>   <!--デフォルトは無効-->
                        @foreach($genres as $id => $genre)
                            <option value="{{$id}}">{{$genre}}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            @endif
        </div>
        <div class="row mt-5">
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


        <div class="row mt-5">
            <div class="col-12">
                <input type="submit" class="btn btn-outline-success" value="本棚に追加する" id="submit-button">
            </div>
        </div>
    
    </form>
    
</div>
<script src="{{asset('js/book/add.js')}}"></script>
@endsection