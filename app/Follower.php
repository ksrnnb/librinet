<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Events\Followed;
use App\Events\Unfollowed;

class Follower extends Model
{
    protected $guarded = ['id'];

    protected $dispatchesEvents = [
        'created' => Followed::class,
        'deleted' => Unfollowed::class,
    ];

    public function followUser()
    {
        return $this->belongsTo('App\User', 'follow_id');
    }

    public function followerUser()
    {
        return $this->belongsTo('App\User', 'follower_id');
    }

    public function notification()
    {
        return $this->hasOne('App\Notification');
    }

    public static function getFollowers($follow_id)
    {
        $followers = Follower::where('follow_id', $follow_id)->get();

        return $followers;
    }
    
    public static function getFollowersOrFollowsByStrId(string $str_id, string $target)
    {
        // TODO: ちょっとまわりくどい、もう少し整理できないか？
        // いったんパスパラメータのstr_idからユーザーをとってきて、
        // フォローorフォロワーのIDをとって、またユーザーをとってきている。
        $user = User::where('str_id', $str_id)->first();
        
        $target_id = $target === 'follows' ? 'follower_id' : 'follow_id';
        $another_id = $target === 'follows' ? 'follow_id' : 'follower_id';

        $targets = Follower::where($target_id, $user->id)->get();

        $ids = $targets->map(
            function ($target) use ($another_id) {
                return $target->$another_id;
            }
        );

        $users = User::whereIn('id', $ids)->get();

        // 本の情報などをとってくる。遅延eager Loading
        $users = User::getUsersProfileData($users);
        
        return $users;
    }
}
