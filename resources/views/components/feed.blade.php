<div class="row">
    <div class="item col-12" style="border: solid 1px blue">
        <div class="row pt-2">
            <div class="col-2 px-0">
                 @if(isset($item->book))
                    <?php $book_url = '/book/show/' . $item->book->isbn ?>
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
                            <a href="{{'/user/show/' . $item->user->str_id}}">
                                <img class="img-fluid" src="{{$item->user->image}}" alt="user-icon">
                            </a>
                        @else
                            <a href="{{'/user/show/' . $item->user->str_id}}">
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
                            <!-- コメント -->
                            @if($item instanceof App\Post)
                                <?php $post_url = '/post/' . $item->uuid; ?>
                                <!-- TODO: アイコンに変える -->
                                <p><a href="{{$post_url}}" class="comment-link">Comment</a></p>
                            @endif
                            <!-- いいね -->
                            <?php $like_url = '/like/' . $item->uuid; ?>
                            <form action="{{$like_url}}" method="POST">
                                @csrf
                                @if($item->likes->contains('user_id', Auth::id()))
                                    <button class="likes btn btn-info">いいね</button>
                                @else
                                    <button class="likes btn btn-outline-info" data-isLiked=0>いいね</button>
                                @endif
                                <p class="d-inline count" data-count="{{$item->likes->count()}}">{{$item->likes->count()}}</p>
                            </form>
                        </div>
                        <!-- 削除機能 自分の投稿のみ-->
                        @if ($item->user_id == Auth::id())

                            @if ($item instanceof App\Post)
                                <div class="mt-5">
                                    <?php $delete_url = '/post/remove/' . $item->uuid; ?>
                                    <form action="{{$delete_url}}" method="POST">
                                        @csrf
                                        <!-- TODO: ドロップダウンにしたい -->
                                        <button class="btn btn-outline-danger" id="{{'del-' . $item->uuid}}" name="delete">削除する</buddon>
                                    </form>
                                </div>
                            {{--$itemがコメントの場合--}}
                            @else
                                <div class="mt-5">
                                    <?php $delete_url = '/comment/remove/' . $item->uuid; ?>
                                    <form action="{{$delete_url}}" method="POST">
                                        @csrf
                                        <!-- TODO: ドロップダウンにしたい -->
                                        <!--  暫定で投稿と区別するようにしてるけど、あとで統一する -->
                                        <button class="btn btn-danger" id="{{'del-' . $item->uuid}}" name="delete">削除する</buddon>
                                    </form>
                                </div>
                            @endif

                        @endif
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