
@extends('layouts.layout')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-12">
            @if ($type == 'follow')
                <?php $user = 'followUser';?>
                <h3>フォロー</h3>
                
            @elseif ($type == 'follower')
                <?php $user = 'followerUser';?>
                <h3>フォロワー</h3>
            @endif
        </div>
    </div>  

    @foreach ($people as $person)
        @if ($person->$user)
            @include('components.user', ['user' => $person->$user])
        @endif
    @endforeach

</div>

@endsection('content')