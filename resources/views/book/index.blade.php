@extends('layouts.layout')

@section('content')
<div class="container">
    <input type="hidden" id="user-id" value="{{Auth::user()->str_id}}">
    <div id="book-react">
            <!-- 検索フォーム -->
    </div>
</div>

@endsection