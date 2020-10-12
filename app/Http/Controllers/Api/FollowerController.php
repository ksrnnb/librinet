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

        // targetId2, isfollowing true, viewerID 6,
        $will_follow = ! $form['isFollowing'];
        $follow_id = $form['targetId'];
        $follower_id = $form['viewerId'];
        
        if ($will_follow) {
            // TODO: もし既に存在していた場合、、、
            Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);

            $follower_users = Follower::getFollowers($follow_id);

            return response()->json($follower_users);
        } else {
            // TODO: 存在しない場合、、、
            Follower::where('follower_id', $follower_id)
                    ->where('follow_id', $follow_id)
                    ->first()
                    ->delete();

            $follower_users = Follower::getFollowers($follow_id);

            return response($follower_users);
        }
    }
}
