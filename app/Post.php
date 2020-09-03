<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public function book() {
        return $this->hasOne('App\Book');
    }

    public function comments() {
        return $this->hasMany('App\Comment');
    }

    public function likes() {
        return $this->hasMany('App\Like');
    }
}
