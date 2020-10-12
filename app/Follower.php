<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    protected $guarded = ['id'];

    public function followUser()
    {
        return $this->belongsTo('App\User', 'follow_id');
    }

    public function followerUser()
    {
        return $this->belongsTo('App\User', 'follower_id');
    }

    public static function getFollowers($follow_id)
    {
        $followers = Follower::where('follow_id', $follow_id)->get();

        return $followers;
    }
}
