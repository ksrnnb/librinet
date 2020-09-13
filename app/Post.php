<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\DB;

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

    public function createComment ($user_id, $message, $book_id = null)
    {
        if ($book_id) {
            $this->comments()
                ->create([
                    'user_id' => $user_id,
                    'message' => $message,
                    'book_id' => $book_id,
                ]);
        } else {
            $this->comments()
                ->create([
                    'user_id' => $user_id,
                    'message' => $message,
                ]);
        }
    }

    public static function checkHomeSqlLog($posts)
    {
        \DB::enableQueryLog();
        foreach($posts as $post) {
            //  全部のPostをとってきてるから、ユーザーが入ってないときは処理しないようにしている
            if (isset($post->user)) {
                echo '<p>' . $post->user->id . '</p>';
                echo '<p>' . $post->user->name . '</p>';
                echo '<p>' . $post->book->cover . '</p>';
                echo '<p>' . $post->message . '</p>';
                echo '<h2>Likes:' . $post->likes->count() . '</h2>';
            }
            if (isset($post->comments)) {
    
                foreach($post->comments as $comment) {
                    echo '<div style="border: 1px solid black">';

                    if (isset($comment->book)) {
                        
                        echo '<p>' . $comment->book->cover . '</p>';
                    }
                    echo '<p>' . $comment->user->name . '</p>';
                    echo '<p>' . $comment->message . '</p>';
                    echo '<h2>Likes:' . $comment->likes->count() . '</h2>';
                    echo '</div>';
                }   
            }
        }
        dd(\DB::getQueryLog());
    }
}
