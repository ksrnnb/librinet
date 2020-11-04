<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Post;
use App\Comment;
use App\Like;
use App\Events\Liked;

class Like extends Model
{
    protected $guarded = ['id'];

    protected $dispatchesEvents = [
        'created' => Liked::class,
    ];
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }
    
    public function comment()
    {
        return $this->belongsTo('App\Comment');
    }

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    public function notification()
    {
        return $this->hasOne('App\Notification');
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
        
        $like = Like::create([
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

    public static function likeOrUnlike($item)
    {
        // postもcommentもない場合は不正なリクエスト
        if ($item == null) {
            abort('400');
        }
        
        $user_id = Auth::id();
        $is_liked = $item->likes->contains('user_id', $user_id);
        
        if ($is_liked) {
            Like::unlike($user_id, $item);
        } else {
            Like::like($user_id, $item);
        }
    }

    public static function handleLike($uuid)
    {
        // みつからない場合の返り値はnull
        $post = Post::where('uuid', $uuid)->first();
        $comment = Comment::where('uuid', $uuid)->first();

        $item = $post ?? $comment;

        Like::likeOrUnlike($item);
    }
}
