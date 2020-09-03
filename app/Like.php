<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    public function comment() {
        return $this->hasOne('App\Comment');
    }

    public function post() {
        return $this->hasOne('App\Post');
    }
}
