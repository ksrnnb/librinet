<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
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

    public function registerBookAndPost($state, $message)
    {
        if ($state) {
            $this->books()
                ->save(factory(Book::class)->states($state)->make())
                ->registerPost($message);
        } else {
            $this->books()
                ->save(factory(Book::class)->make())
                ->registerPost($message);
        }
    }
}
