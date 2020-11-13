<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
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
            $is_already_created = Follower::where('follow_id', $follow_id)
                                          ->where('follower_id', $follower_id)
                                          ->first();
            
            // もし既に存在していた場合
            if ($is_already_created) {
                return response('エラーが発生しました', 422);
            }

            Gate::authorize('create-follower');
            
            $follower = Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);

            $follower_users = Follower::getFollowers($follow_id);

            return response()->json($follower_users);
        } else {
            $follower = Follower::where('follower_id', $follower_id)
                                ->where('follow_id', $follow_id)
                                ->first();
            
            // 存在しない場合
            if (!$follower) {
                return response('エラーが発生しました', 422);
            }
            
            Gate::authorize('delete-follower', $follower);

            $follower->delete();

            $follower_users = Follower::getFollowers($follow_id);

            return response($follower_users);
        }
    }

    public function followers(Request $request, string $str_id, string $target): JsonResponse
    {
        $users = Follower::getFollowersOrFollowsByStrId($str_id, $target);

        return response()->json($users);
    }
}
