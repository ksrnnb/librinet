<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    public function post() {
        return $this->hasOne('App\Post');
    }

    public function likes() {
        return $this->hasMany('App\Like');
    }
}
