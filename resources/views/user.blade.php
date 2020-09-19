
@extends('layouts.layout')

@section('content')

<?php $url = request()->fullUrl(); ?>
<?php $auth_id = Auth::id(); ?>

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

            <!-- ユーザー自身だったら表示しない -->
            @if ($user->id != $auth_id)
                <form action="{{$url}}" method="POST">
                    @csrf
                    <input type="hidden" name="follow_id" value="{{$user->id}}">
                    <input type="hidden" name="follower_id" value="{{Auth::id()}}">
                    @if ($is_following)
                        <button class="invalid" name="action" value="unfollow">フォローを外す</button>
                    @else
                        <button name="action" value="follow">フォローする</button>
                    @endif

                </form>
            @endif
        </div>
    </div>

    <div class="row follow">
        <div class="col-12">
            <a id="follow-link" href="{{$url . '/follows'}}">
                <p id="follow" data-count="{{$follows}}">フォロー: {{$follows}}</p>
            </a>
            <a id="follower-link" href="{{$url . '/followers'}}">
                <p id="follower" data-count="{{$followers}}">フォロワー: {{$followers}}</p>
            </a>
        </div>
    </div>

    <div class="row mt-5">
        <div class="col-6">
            <h2>本棚</h2>
        </div>
        
        <!-- 編集機能 -->
        @if ($user->id == $auth_id)
            @if ($genres_books->isNotEmpty())
                <div class="col-6">
                    <a href="{{$url . '/book/edit'}}">
                        <button type="submit" class="btn btn-outline-success">ジャンルを編集する</button>
                    </a>
                    <a href="{{$url . '/book/delete'}}">
                        <button type="submit" class="btn btn-outline-danger">本を削除する</button>
                    </a>
                </div>
            @endif
        @endif
    </div>
    <div class="row book-shelf">
        <div class="col-12">
            @if($genres_books->isEmpty())
                <p class="text-danger">本棚に本がありません</p>
                <p>本棚に本を追加しましょう！</p>
                <a href="/book">
                    <button type="button" class="btn btn-outline-success">
                        本を探す
                    </button>
                </a>
            @else
                @foreach($genres_books as $genre_id => $books)
                    <p class="h2 mt-2">{{$genres[$genre_id]}}</p>
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
            @endif
        </div>
    </div>
</div>

@endsection