
@extends('layouts.layout')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-12">
            <h2>コメント画面</h2>
            @include('components.feed', ['item' => $post])

            @isset($post->comments)
                @foreach($post->comments as $comment)
                    @include('components.feed', ['item' => $comment])
                @endforeach
            @endisset
        </div>
    </div>
    <div class="row mt-5">
        <div class="col-12">
            <h4>コメント</h4>
        </div>
    </div>
    <form action="{{request()->fullUrl()}}" method="POST">
        @csrf
        <input type="hidden" name="post_id" value="{{$post->id}}">
        <div class="row">
            <div class="col-12">
                <textarea name="message" cols="30" rows="10" required></textarea>
            </div>
        </div>
        
        <!-- TODO：本がない場合の処理が必要 -->
        <div class="row mt-5">
            <div class="col-12">
                <label for="recommend">
                    <input type="checkbox" name="recommend" id="recommend"> 本もおすすめする
                </label>
                
            </div>
        </div>
        
        <div id="recommend-book" class="invalid">
            <div class="row">
                <div class="col-12">
                    <p>本棚から選ぶ</p>
                    <select name="book_id" id="select-book" disabled>
                        @foreach($genres_books as $genre_id => $books)
                            <optgroup label="{{$genres[$genre_id]}}">
                                @foreach($books as $book)
                                    <option value="{{$book->id}}">{{$book->title}}</option>
                                @endforeach
                            </optgroup>
                        @endforeach
                    </select>
                    
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-12">
                <input type="submit" id="submit" value="コメントする">
            </div>
        </div>
    </form>
    

</div>

<script src="{{asset('js/post.js')}}"></script>
@endsection('content')