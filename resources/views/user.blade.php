<!-- $user: Eloquent collection (root parameter is str_id: BILVll6j) -->

@extends('layouts.layout')

@section('content')
<div id="user-react"></div>


<script>
  window.user = @json($user);
  window.books = @json($books);
</script>
<script src="{{asset('js/app.js')}}"></script>

@endsection