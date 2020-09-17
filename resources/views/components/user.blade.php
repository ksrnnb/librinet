<div class="row mt-5">
    <div class="col-2">
        <!-- TODO:　あとでリンクの修正が必要 -->
        <?php $link = "/user/" . $user->str_id ?>
        @if($user->image)
            <a class="user-link" href="{{$link}}" data-id="{{$user->str_id}}">
                <img class="img-fluid"src="{{$user->image}}" alt="user-image">
            </a>
        @else
            <a class="user-link" href="{{$link}}" data-id="{{$user->str_id}}">
                <img class="img-fluid" href="{{$link}}" src="{{asset('img/icon.svg')}}" alt="user-image">
            </a>
        @endif

    
    </div>
    <div class="col-10">
        <p class="h4">{{$user->name}}</p>
        <p class="h5">{{'@' . $user->str_id}}</p>
    </div>
</div>