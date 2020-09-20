<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\DB;
use Exception;

class Post extends Model
{
    protected $guarded = ['id'];

    public function book()
    {
        return $this->belongsTo('App\Book', 'book_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function likes()
    {
        return $this->hasMany('App\Like');
    }

    // 削除時の動作をオーバーライド
    public function delete()
    {
        $post = $this;

        parent::delete();

        // TODO: ほぼ同じ動作している、まとめられないか？

        $comments = Comment::where('post_id', $post->id)->get();
        
        foreach ($comments as $comment) {
            $comment->delete();
        }

        $likes = Like::where('post_id', $post->id)->get();
        
        foreach ($likes as $likes) {
            $likes->delete();
        }

        $book = Book::find($post->book_id);
        
        if ($book) {
            $book->delete();
        }
        
    }

    public function createComment ($user_id, $message, $book_id = null)
    {
        if ($book_id) {
            $this->comments()
                ->create([
                    'uuid' => Str::uuid(),
                    'user_id' => $user_id,
                    'message' => $message,
                    'book_id' => $book_id,
                ]);
        } else {
            $this->comments()
                ->create([
                    'uuid' => Str::uuid(),
                    'user_id' => $user_id,
                    'message' => $message,
                ]);
        }
    }

    // 本の追加、ジャンルの追加、新しい投稿の作成
    public static function createNewPost($form)
    {        
        $book = Book::createNewBook($form);

        $book->registerPost($form->get('message'));
    }

    public static function returnPostsOfFollowingUsers($user)
    {
        $followers = $user->following;

        $followIds = $followers->map(function($follower) {
            return $follower->follow_id;           
        });

        //  自身のPostも追加
        $allPostsIds = collect($followIds)->push($user->id);

        //  疑問点: Eagerローディング / load多すぎないか？　DB設計がこれでいいのかどうか...
        $posts = Post::with(['user' => function($query) use ($allPostsIds) {
            $query->whereIn('id', $allPostsIds);
        }])->get();

        $posts->load('book', 'likes', 'comments.likes', 'comments.user', 'comments.book');

        /*
            posts: [[Post], [Post], ...]
        */

        // 新しい投稿が上に表示されるように、降順でソート
        $posts = $posts->sortByDesc(function ($product, $key) {
            return $product->updated_at;
        })->values();

        return $posts;
    }
}
