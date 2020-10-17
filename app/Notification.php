<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $guarded = ['id'];

    public function comment()
    {
        return $this->belongsTo('App\Comment');
    }

    public function like()
    {
        return $this->belongsTo('App\Like');
    }

    public function follower()
    {
        return $this->belongsTo('App\Follower', 'follower_id', 'follower_id');
    }
}
