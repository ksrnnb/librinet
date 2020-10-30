<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use App\Post;
use App\User;
use App\Comment;
use App\Events\Commented;

class CommentController extends Controller
{

    public function get(Request $request, $id)
    {
        $comment = Comment::find($id);

        if ($comment) {
            $post = Post::where('id', $comment->post_id)->first();
            $post->loadPostInfoAndComments();
            return response()->json($post);
        }

        return response('投稿がみつかりませんでした', 404);
    }

    public function add(Request $request, $uuid)
    {
        if (Str::isUUid($uuid)) {
            // $post = Post::where('uuid', $uuid)->first();
            $post = Post::where('uuid', $uuid)->first();
            
            if ($post) {
                $post->loadPostInfoAndComments();
                return response()->json($post);
            
            // Postではない場合
            } else {
                $comment = Comment::with(['user', 'book', 'likes'])
                                    ->get()
                                    ->where('uuid', $uuid)
                                    ->first();

                // Commentがみつかったら
                if ($comment) {
                    $params = [
                        'item' => $comment,
                        'is_post' => false,
                    ];

                    return response()->json($params);

                // PostもCommentも見つからない場合
                } else {
                    return response('投稿がみつかりませんでした', 404);
                }
            }
        
        // そもそもuuidですらない場合
        } else {
            return response('投稿がみつかりませんでした', 404);
        }
    }

    public function create(Request $request)
    {
        Gate::authorize('create-comment');

        // TODO: validation
        // return response()->json($request->input());
        $form = $request->input();
        $params = [
            'message' => $form['message'],
            'post_id' => $form['post_id'],
            'user_id' => $form['user_id'],
            'uuid'    => Str::uuid(),
        ];

        if ($form['book_id']) {
            $params = array_merge(
                $params,
                ['book_id' => $form['book_id']]
            );
        }

        if (isset($form['post_id'])) {
            $comment = Comment::create($params);
            event(new Commented($comment));
        }
        $user = Auth::user();
        $params = User::getParamsForApp($user->str_id);

        return response()->json($params);
    }

    public function delete(Request $request)
    {
        // DELETE methodのため、プロパティに入ってる
        $comment = Comment::where('uuid', $request->uuid)->first();

        // ユーザーIDの確認
        Gate::authorize('delete-comment', $comment);

        $comment->delete();

        $posts = Post::getPostsOfFollowingUsers(Auth::user());

        return response($posts);
    }
}
