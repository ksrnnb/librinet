<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'str_id', 'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function books()
    {
        return $this->hasMany('App\Book');
    }

    public function posts()
    {
        return $this->hasMany('App\Post');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function followers()
    {
        return $this->hasMany('App\Follower', 'follow_id', 'id');
    }

    public function following()
    {
        return $this->hasMany('App\Follower', 'follower_id', 'id');
    }

    // 削除時の動作をオーバーライド
    public function delete()
    {
        $user_id = $this->id;

        \DB::transaction(function () use ($user_id) {

            parent::delete();
            
            // もうちょいいいかんじに消したい
            $posts = Post::where('user_id', $user_id)->get();
            
            foreach ($posts as $post) {
                $post->delete();
            }
            
            $comments = Comment::where('user_id', $user_id)->get();
            
            foreach ($comments as $comment) {
                $comment->delete();
            }

            $followers = Follower::where('follow_id', $user_id)->get();

            foreach ($followers as $follower) {
                $follower->delete();
            }

            $follows = Follower::where('follower_id', $user_id)->get();

            foreach ($follows as $follow) {
                $follow->delete();
            }
        });
    }

    public static function returnParamsForGuestUser()
    {
        $params = [
            'str_id' => 'guest',
            'name' => 'ゲスト',
            'email' => 'guest@guest.com',
            'email_verified_at' => now(),
            'image' => '/img/icon_green.svg',
            'password' => Hash::make(env('GUEST_PASSWORD')),
            'remember_token' => Str::random(10),
        ];
        
        return $params;
    }



    public static function getArrayForUserPageView($str_id)
    {
        $users = User::with(['books.genre'])->get();
        $user = $users->where('str_id', $str_id)->first();      // select user
        $books = $user->books->where('isInBookshelf', true);    // 本棚に追加した本だけを抽出
        $genres = Book::extractGenres($books);
        $genres_books = $books->groupBy('genre_id');
        /*
            genres:                  [genre_id => genre_name, ...]
            genres_books: [[genre_id => [book, book, ...]], ...]
        */
        $params = [
            'user' => $user,
            'books' => $books,
            'genres' => $genres,
            'genres_books' => $genres_books,
        ];

        return $params;
    }

    /*
        return boolean (user has book or not)
    */
    public function hasBook($isbn)
    {
        $books = Book::where('user_id', $this->id)
                     ->where('isbn', $isbn)
                     ->get();
        
        if ($books->isEmpty()) {
            return false;
        } else {
            return $books->contains('isInBookshelf', true);
        }
    }
}
