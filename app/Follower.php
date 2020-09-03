<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    //TODO  規約通りでないので引数の修正。
    public function follow_user() {
        return $this->hasOne('App\User');
    }

    //TODO  規約通りでないので引数の修正。
    public function follower_user() {
        return $this->hasOne('App\User');
    }
}
