<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Follower;
use App\Post;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        // TODO: ユーザー認証機能を追加したときに修正する。
        $userId = 1;
        $user = User::find($userId);

        // TODO: モデル側に処理をもっていく。
        
        $followers = $user->following;
 
        $followIds = $followers->map(function($follower) {
            return $follower->follow_id;           
        });

        $allPostsIds = collect($followIds)->push($userId);

        $users = User::with(['posts' => function($query) use ($allPostsIds) {
            $query->whereIn('user_id', $allPostsIds);
        }])->get();

        // TODO @user_nameのPostもとってくるようにする。

        /*
            allPosts: [[Post], [Post], ...]
        */
        $allPosts = $users->map(function($user) {    
            return $user->posts->map(function($post) {
                return $post;
            });
        });

        return view('home', ['posts' => $allPosts->flatten()]);
    }
}
