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

    public function likes()
    {
        return $this->hasMany('App\Like');
    }

    public function followers()
    {
        return $this->hasMany('App\Follower', 'follow_id', 'id');
    }

    public function followings()
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
    /**
     * @param string (str_id or user_name)
     */
    public static function searchUsersAndGetUsersProfileData($input)
    {
        $users = User::where('str_id', 'like', '%' . $input . '%')
                     ->orWhere('name', 'like', '%' . $input . '%')
                     ->get();

        $users = User::getUsersProfileData($users);

        return $users;
    }

    public static function getUsersProfileData($users)
    {
        if ($users->isNotEmpty()) {
            // SQL文10個になっている。
            $users = $users->load(['books.genre',
                                'posts.likes',
                                'comments.likes',
                                'likes',
                                'followings',
                                'followers',
                                ]);

            foreach ($users as $user) {
                // 扱いやすいように整理した[genre_id => books]の配列を返す
                [$genres, $ordered_books] = Book::getGenresAndOrderedBooks($user->books);
                $user->genres = $genres;
                $user->ordered_books = $ordered_books;
            }
        } else {
            $users = [];
        }

        return $users;
    }

    /**
     * @param string (str_id or user_name)
     */
    public static function getIdentifiedUserProfileData(string $str_id)
    {
        $user = User::where('str_id', $str_id)
                     ->first();

        if ($user) {
            // SQL文10個になっている。
            $user = $user->load(['books.genre',
                                'posts.likes',
                                'comments.likes',
                                'likes',
                                'followings',
                                'followers',
                                ]);

            [$genres, $ordered_books] = Book::getGenresAndOrderedBooks($user->books);
            $user->genres = $genres;
            $user->ordered_books = $ordered_books;
        } else {
            $user = [];
        }

        return $user;
    }

    public static function getParamsForApp($str_id): array
    {
        $user = User::getIdentifiedUserProfileData($str_id);
        
        $following_posts = Post::getPostsOfFollowingUsers($user);

        // ユーザーの検索ページ用
        $examples = User::getExampleUsers()['examples'];

        $params = compact('user', 'following_posts', 'examples');

        return $params;
    }

    public static function getExampleUsers()
    {
        $params = [
            'examples' => User::whereIn('id', [1, 2, 3])->get(),
        ];

        return $params;
    }

    public function getFollowsAndFollowersUsers(): array
    {
        // フォロー数、フォロワー数を取得
        $follows = $this->followings->where('follower_id', $this->id);
        $followers = $this->followers->where('follow_id', $this->id);

        $params = compact('follows', 'followers');

        return $params;
    }

    public function getFollowDataForUserPageView($viewer_id)
    {
        $is_following = false;
        $viewer_followings = Follwer::where('follower_id', $viewer_id);
        
        if ($viewer_followings->isNotEmpty()) {
            $is_following = $viewer_followings->groupBy('follow_id')
                                              ->has($this->id);
        }

        // フォロー数、フォロワー数を取得
        $params = $this->getFollowsAndFollowersNumber();
        $params = array_merge($params, compact('is_following'));

        // ['follows' => ..., 'followers' => ..., 'is_following' => ...]
        return $params;
    }

    public static function returnParamsForGuestUser()
    {
        $params = [
            'str_id' => 'guest',
            'name' => 'ゲスト',
            'email' => 'guest@guest.com',
            'email_verified_at' => now(),
            'image' => '/img/icon_green.svg',
            'password' => Hash::make(config('app.guest_password')),
            'remember_token' => Str::random(10),
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

    public static function updateUser($params)
    {
        $user = User::find($params['id']);

        foreach ($params as $key => $value) {
            $user->$key = $value;
        }

        $user->save();

        return true;
    }
}
