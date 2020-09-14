
@extends('layouts.layout')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-12">
            @if ($type == 'follow')
                <?php $user = 'follow_user';?>
                <h3>フォロー</h3>
                
            @elseif ($type == 'follower')
                <?php $user = 'follower_user';?>
                <h3>フォロワー</h3>
            @endif
        </div>
    </div>  

    @foreach ($people as $person)
        @if ($person->$user)
            <div class="row mt-5">
                <div class="col-2">
                    <?php $link = "/user/" . $person->$user->str_id ?>
                    @if($person->$user->image)
                        <a href="{{$link}}">
                            <img class="img-fluid"src="{{$person->$user->image}}" alt="user-image">
                        </a>
                    @else
                        <a href="{{$link}}">
                            <img class="img-fluid" href="{{$link}}" src="{{asset('img/icon.svg')}}" alt="user-image">
                        </a>
                    @endif

                
                </div>
                <div class="col-10">
                    <p class="h4">{{$person->$user->name}}</p>
                    <p class="h5">{{'@' . $person->$user->str_id}}</p>
                </div>
            </div>
        @endif
    @endforeach

</div>

@endsection('content')