<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Follower;
use App\Post;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $posts = Post::returnPostsOfFollowingUsers($user);
        
        return view('home', ['posts' => $posts]);
    }
}
