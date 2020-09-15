<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Like;


class LikeController extends Controller
{
    public function like (Request $request, $uuid)
    {
        $is_uuid = Str::isUuid($uuid);
        
        if ($is_uuid) {
            
            Like::handleLike($uuid);
            // // みつからない場合はnull
            // $post = Post::where('uuid', $uuid)->first();
            // $user_id = Auth::id();
    
            // if (isset($post)) {
            //     $is_liked = $post->likes->contains('user_id', $user_id);
            //     if ($is_liked) {
            //         Like::where('user_id', $user_id)
            //             ->where('post_id', $post->id)
            //             ->first()
            //             ->delete();
            //     } else {
            //         Like::create([
            //             'user_id' => $user_id,
            //             'post_id' => $post->id,
            //         ]);
            //     }
            // } else {
            //     $comment = Comment::where('uuid', $uuid)->first();
            //     $is_liked = $comment->likes->contains('user_id', Auth::id());

            //     if ($is_liked) {
            //         Like::where('user_id', $user_id)
            //             ->where('comment_id', $comment->id)
            //             ->first()
            //             ->delete();
            //     } else {
            //         Like::create([
            //             'user_id' => $user_id,
            //             'comment_id' => $comment->id,
            //         ]);
            //     }
            // }

        // TODO：エラーにとばす？　（uuidが送られてない場合）
        } else {
            return back();
        }

        return back();

    }
}
