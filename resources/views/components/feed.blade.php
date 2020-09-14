<div class="row">
    <div class="item col-12" style="border: solid 1px blue">
        <div class="row pt-2">
            <div class="col-2 px-0">
                 @if(isset($item->book))
                    <?php $book_url = '/book/' . $item->book->isbn ?>
                    <figure class="mx-2 px-0 mb-0 book">
                        <a href="{{$book_url}}">
                        @if($item->book->cover)
                            <img class="img-fluid" src="{{$item->book->cover}}" alt="book_image">
                        @else
                            <img class="img-fluid" src="{{asset('img/book.svg')}}" alt="book_image">
                        @endif
                        </a>
                    </figure>
                @else
                    <div class="mx-2"></div>
                @endif
            </div>
            <div class="user col-10">
                <div class="row">
                    <div class="avator col-2">
                        @if($item->user->image)
                            {{-- TODO: ユーザー画像登録したら本当に表示されるか、確認する --}}
                            <a href="{{'/user/' . $item->user->str_id}}">
                                <img class="img-fluid" src="{{$item->user->image}}" alt="user-icon">
                            </a>
                        @else
                            <a href="{{'/user/' . $item->user->str_id}}">
                                <img class="img-fluid" src="{{asset('img/icon.svg')}}" alt="user-icon">
                            </a>
                        @endif
                    </div>
                    <div class="col-10">
                        <p class="h4 d-inline mr-1">{{$item->user->name}}</p>
                        <p class="d-inline">{{' @' . $item->user->str_id}}</p>
                        <p>{{$item->message}}</p>

                        <!-- コメント、いいね機能とか -->
                        <div>
                            @if(isset($item->uuid))
                                <?php $post_url = '/post/' . $item->uuid; ?>
                                <!-- TODO: アイコンに変える -->
                                <p><a href="{{$post_url}}">Comment</a></p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>   
        </div>
        @if(isset($item->book))
            <p class="book-title my-2">{{$item->book->title}} （ {{$item->book->author}} ）</p>
        @else
            <p class="book-title my-2"></p>
        @endif
    </div>
</div>