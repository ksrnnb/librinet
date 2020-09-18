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

    public static function getFollowDataForUserPageView($user, $viewer_id)
    {
        $is_following = false;

        $f_table = Follower::all();
        $viewer_followings = $f_table->where('follower_id', $viewer_id);
        
        if ($viewer_followings->isNotEmpty()) {
            $is_following = $viewer_followings->groupBy('follow_id')
                                              ->has($user->id);
        }

        // フォロー数、フォロワー数を取得
        $follows = $f_table->where('follower_id', $user->id)->count();
        $followers = $f_table->where('follow_id', $user->id)->count();

        $params = [
            'is_following' => $is_following,
            'follows' => $follows,
            'followers' => $followers,
        ];

        return $params;
    }
}
