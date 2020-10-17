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
    public function get(Request $request, $id)
    {
        $post = Post::find($id);
        if ($post) {
            $post->loadPostInfoAndComments();
            return response()->json($post);
        }

        return response('投稿がみつかりません', 404);
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
