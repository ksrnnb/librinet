<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\DB;
use App\Events\Commented;

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

    public function notification()
    {
        return $this->hasOne('App\Notification');
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

    public function createComment($user_id, $message, $book_id = null)
    {
        if ($book_id) {
            $comment = $this->comments()
                            ->create([
                                'uuid' => Str::uuid(),
                                'user_id' => $user_id,
                                'message' => $message,
                                'book_id' => $book_id,
                            ]);
        } else {
            $comment = $this->comments()
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

    public function loadPostInfoAndComments()
    {
        // 投稿のユーザー、本、いいね、コメントのいいね、ユーザー、本
        $this->load('user', 'book', 'likes', 'comments.user', 'comments.book', 'comments.likes');
    }

    public static function getPostsOfFollowingUsers($user)
    {
        $followers = $user->followings;

        $followIds = $followers->map(function ($follower) {
            return $follower->follow_id;
        });

        //  自身のPostも追加
        $allPostsIds = collect($followIds)->push($user->id);

        $posts = Post::with(['user' => function ($query) use ($allPostsIds) {
            $query->whereIn('id', $allPostsIds);
        }])->get();

        $posts->load('book', 'likes', 'comments.user', 'comments.likes', 'comments.book');
        /*
            posts: [[Post], [Post], ...]
        */

        // 新しい投稿が上に表示されるように、降順でソート
        $posts = $posts->sortByDesc(function ($product, $key) {
            return $product->updated_at;
        })->values();

        // TODO:　投稿数が増えた際に、ボタン押したらリロードするようにしたい
        // 仮で最大100個
        // フォローしているユーザーの投稿のみ
        $posts = $posts->whereIn('user_id', $allPostsIds);
        $posts = $posts->take(100);

        return $posts;
    }
}
