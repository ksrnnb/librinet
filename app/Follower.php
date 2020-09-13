<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    protected $guarded = ['id'];

    // NOTICE: 使用時は$follower->follow_userのように()は不要なので注意！
    public function follow_user()
    {
        return $this->belongsTo('App\User', 'follow_id');
    }

    // NOTICE: 使用時は$follower->follow_userのように()は不要なので注意！
    public function follower_user()
    {
        return $this->belongsTo('App\User', 'follower_id');
    }
}
