<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Follower;

class FollowerController extends Controller
{
    public function follow(Request $request)
    {
        $form = $request->input();

        $will_follow = ! $form['isFollowing'];
        $follow_id = $form['targetId'];
        $follower_id = $form['viewerId'];
        
        if ($will_follow) {
            // TODO: もし既に存在していた場合、、、
            Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);

            return response('follow!');
        } else {
            // TODO: 存在しない場合、、、
            Follower::where('follower_id', $follower_id)
                    ->where('follow_id', $follow_id)
                    ->first()
                    ->delete();
            return response('unFollow!');
        }
    }
}
