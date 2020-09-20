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
}
