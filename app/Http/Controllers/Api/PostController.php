<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
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
        Gate::authorize('create-book');

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
        // DELETE methodのため、uuidは$requestのプロパティに直で入ってる
        $post = Post::where('uuid', $request->uuid)->first();
        if ($post) {
            // ここで認可の処理。異なる場合はuser idが異なる場合はここで処理が止まって403エラーを返す。
            Gate::authorize('delete-post', $post);
    
            $post->delete();
    
            $posts = Post::getPostsOfFollowingUsers(Auth::user());
    
            return response($posts);
        } else {
            return bad_request();
        }
    }
}
