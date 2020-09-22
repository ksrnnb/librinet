<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Follower;

class FollowerController extends Controller
{
    public function follow (Request $request)
    {
        $form = $request->except('_token');

        $action       = $form['action'];
        $follow_id    = $form['follow_id'];
        $follower_id  = $form['follower_id'];

        if ($action == 'follow') {
            // TODO: もし既に存在していた場合、、、
            Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);
        } elseif ($action == 'unfollow') {
            // TODO: 存在しない場合、、、
            Follower::where('follower_id', $follower_id)
                    ->where('follow_id', $follow_id)
                    ->first()
                    ->delete();
        } else {
            // error
            abort('400');
        }

        return back();
    }
}
