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

        //  自身のPostも追加
        $allPostsIds = collect($followIds)->push($userId);

        //  疑問点: Eagerローディング / load多すぎないか？　DB設計がこれでいいのかどうか...
        $posts = Post::with(['user' => function($query) use ($allPostsIds) {
            $query->whereIn('id', $allPostsIds);
        }])->get();

        $posts->load('book', 'likes', 'comments.likes', 'comments.user', 'comments.book');

        /*
            posts: [[Post], [Post], ...]
        */

        // 新しい投稿が上に表示されるように、降順でソート
        $posts = $posts->sortByDesc(function ($product, $key) {
            return $product->updated_at;
        })->values();

        // 最後の行に[]と出力されるだけならEagerローディングできている。
        // 必要に応じて使用する。
        // Post::checkHomeSqlLog($posts);
        
        return view('home', ['posts' => $posts]);


    }
}
