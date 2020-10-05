<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Str;
use App\Book;
use App\Post;

class PostController extends Controller
{
    public function add(Request $request, $isbn)
    {
        $user = Auth::user();
        $params = Book::returnBookInfoOrRedirect($isbn, $user, 'post');

        if ($params) {
            return response()->json($params);     // params is redirect
        } else {
            return response()->json(['hoge' => 'hoge']);
            // return response($status = 404);
            // return view('book_post', $params);
        }
    }

    // TODO: PostRequestつかう？
    public function create(Request $request)
    {
        // $isIsbn = Book::isIsbn($isbn);

        // TODO: validationしてから
        // 扱いやすいようにcollectionにしている。
        $form = collect($request->input());

        $form = $form->merge(['user_id'   =>  Auth::id()]);

        Post::createNewPost($form);

        return response('done', 200);
    }

    public function remove(Request $request)
    {
        // DELETE methodのため、プロパティに入ってる
        $uuid = $request->uuid;

        // app/helper.php
        $posts = delete_feed_and_get_new_feed($uuid, 'post');

        return response($posts);
    }
}
