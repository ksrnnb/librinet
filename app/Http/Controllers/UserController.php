<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Book;
use App\Follower;

class UserController extends Controller
{
    public function index(Request $request, $str_id)
    {
        $user_book_data = User::getArrayForUserPageView($str_id);

        $viewer_id = Auth::id();
        $user = $user_book_data['user'];
        $follow_data = Follower::getFollowDataForUserPageView($user, $viewer_id);
        
        $params = array_merge($user_book_data, $follow_data);

        return view('user', $params);
        
    }

    public function action (Request $request)
    {
        $form = $request->except('_token');

        $action       = $form['action'];
        $follow_id    = $form['follow_id'];
        $follower_id  = $form['follower_id'];

        if ($action == 'follow') {
            Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);
        } elseif ($action == 'unfollow') {
            Follower::where('follower_id', $follower_id)
                    ->where('follow_id', $follow_id)
                    ->first()
                    ->delete();
        } else {
            // error
        }

        return back();
    }

    public function follows (Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $follows = Follower::with('follow_user')->get();
        $follows = $follows->where('follower_id', $user->id);

        return view ('follow', [
            'type'   => 'follow',
            'people' => $follows,
        ]);
    }

    public function followers (Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $followers = Follower::with('follower_user')->get();
        $followers = $followers->where('follow_id', $user->id);

        return view ('follow', [
            'type'   => 'follower',
            'people' => $followers,
        ]);

    }

    public function search (Request $request)
    {
        return view('user_search');
    }

    public function find (Request $request)
    {
        $user = $request->input('user');
        $users = User::where('str_id', $user)->get();

        // IDと名前が一致する場合を考慮してない
        // また、部分一致の方がいいのでは？？
        if ($users->isEmpty()) {
            $users = User::where('name', $user)->get();
        }
        
        return view('user_search', ['users' => $users]);
    }
    
}
