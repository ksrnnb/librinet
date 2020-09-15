<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Post;
use App\Comment;
use App\Like;


class Like extends Model
{
    protected $guarded = ['id'];
    
    public function comment()
    {
        return $this->belongsTo('App\Comment');
    }

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    /*
        post or comment のモデルから以下の配列を返す
        [
            'key' => 'post_id' or 'comment_id',
            'id'  => post->id  or comment->id
        ]
    */
    public static function returnKeyId($post_or_comment)
    {
        // モデル名を小文字で取得する
        $model_name = get_class($post_or_comment);
        $lower_name = strtolower(explode("\\", $model_name)[1]);

        // post、commentどちらも共通の処理になるように
        $item_key = $lower_name . '_id';
        $item_id = $post_or_comment->id;

        return ['key' => $item_key, 'id' => $item_id];
    }

    public static function like($user_id, $post_or_comment)
    {
        $item = Like::returnKeyId($post_or_comment);
        
        Like::create([
            'user_id' => $user_id,
            $item['key'] => $item['id'],
        ]);

    }

    public static function unlike($user_id, $post_or_comment)
    {
        $item = Like::returnKeyId($post_or_comment);

        Like::where('user_id', $user_id)
            ->where($item['key'], $item['id'])
            ->first()
            ->delete();
    }

    public static function handleLike($uuid)
    {
        // みつからない場合の返り値はnull
        $post = Post::where('uuid', $uuid)->first();
        $user_id = Auth::id();

        // ポストの場合
        if (isset($post)) {
            $is_liked = $post->likes->contains('user_id', $user_id);

            if ($is_liked) {
                Like::unlike($user_id, $post);
            } else {
                Like::like($user_id, $post);
            }

        // コメントの場合
        } else {
            $comment = Comment::where('uuid', $uuid)->first();
            $is_liked = $comment->likes->contains('user_id', Auth::id());

            if ($is_liked) {
                Like::unlike($user_id, $comment);
            } else {
                Like::like($user_id, $comment);
            }
        }

    }
}
