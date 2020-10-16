<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Str;
use App\Book;
use App\Post;
use App\User;

class PostController extends Controller
{
    // TODO: いらないはず。確認したら消す。
    public function add(Request $request, $isbn)
    {
        $user = Auth::user();
        // TODO: 整理する。名前も。。。
        $params = Book::returnBookInfoOrRedirect($isbn, $user, 'post');

        if ($params) {
            return response($params);     // params is redirect
        } else {
            // TODO: どうする？
            return response('');
        }
    }

    // TODO: PostRequestつかう？
    public function create(Request $request)
    {
        // $isIsbn = Book::isIsbn($isbn);
        $user = Auth::user();

        // TODO: validationしてから
        // 扱いやすいようにcollectionにしている。
        $form = collect($request->input());

        $form = $form->merge(['user_id'   =>  $user->id]);

        Post::createNewPost($form);

        $user = User::getParamsForApp($user->str_id);

        return response()->json($user);
    }

    public function delete(Request $request)
    {
        // DELETE methodのため、プロパティに入ってる
        $uuid = $request->uuid;

        // app/helper.php
        $posts = delete_feed_and_get_new_feed($uuid, 'post');

        return response($posts);
    }
}
