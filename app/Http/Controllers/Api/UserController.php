<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class UserController extends Controller
{
    public function auth(Request $request)
    {
        // $user = Auth::user();
        $id = Auth::id();

        $users = User::with(['books' => function ($query) use ($id) {
            $query->where('id', $id);
        }])->get();

        $user = $users->where('id', $id);
    
        // if ($user->isEmpty()) {
        //     return redirect('/');
        // }

        // $user_book_data = User::getArrayForUserPageView($str_id);

        // $viewer_id = Auth::id();
        // $user = $user_book_data['user'];
        // $follow_data = Follower::getFollowDataForUserPageView($user, $viewer_id);
        
        // $params = array_merge($user_book_data, $follow_data);

        // return view('user.index', $params);
        return response()->json($user);
    }
}
