<!-- $user: Eloquent collection (root parameter is str_id: yLhfXC) -->

@extends('layouts.layout')

@section('content')
<div id="user-react"></div>



<!-- TODO: わざわざReactで書かずにBladeで処理するように変えたい。。。 -->
<script>
  window.user = @json($user);
  window.books = @json($books);
  window.genres = @json($genres);
</script>
<script src="{{asset('js/app.js')}}"></script>

@endsection