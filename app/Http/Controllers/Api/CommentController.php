<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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

        return response('投稿がみつかりません', 404);
    }

    public function add(Request $request, $uuid)
    {
        if (Str::isUUid($uuid)) {
            // $post = Post::where('uuid', $uuid)->first();
            $post = Post::with(['user', 'book', 'likes'])
                        ->get()
                        ->where('uuid', $uuid)
                        ->first();

            if ($post) {
                $params = [
                    'item' => $post,
                    'is_post' => true,
                ];

                return response()->json($params);
            
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

                // PostもCommentも見つからない場合 -> 不正なアクセス
                } else {
                    return response('Bad Request', 400);
                }
            }
        
        // そもそもuuidですらない場合 -> 不正なアクセス
        } else {
            return response('Bad Request', 400);
        }
    }

    public function create(Request $request)
    {
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
        $uuid = $request->uuid;

        // app/helper.php
        $posts = delete_feed_and_get_new_feed($uuid, 'comment');

        return response($posts);
    }
}
