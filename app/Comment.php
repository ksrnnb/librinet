<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Events\Commented;

class Comment extends Model
{
    protected $guarded = ['id'];

    protected $dispatchesEvents = [
        'created' => Commented::class,
    ];

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    public function likes()
    {
        return $this->hasMany('App\Like');
    }

    public function book()
    {
        return $this->belongsTo('App\Book', 'book_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    // 削除時の動作をオーバーライド
    public function delete()
    {
        $comment = $this;

        parent::delete();

        $book = Book::find($comment->book_id);
        
        if ($book) {
            $book->delete();
        }

        $likes = Like::where('comment_id', $comment->id)->get();
        
        foreach ($likes as $like) {
            $like->delete();
        }
    }
}
