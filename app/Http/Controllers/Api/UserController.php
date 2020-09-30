<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Book;
use App\Post;

class UserController extends Controller
{
    public function auth(Request $request)
    {
        
        // TODO: 認証されてない場合は？？？
        // $users = User::with(['books' => function ($query) use ($id) {
            //     $query->where('user_id', $id);
            // }])->get();
            
        $str_id = Auth::user()->str_id;

        $user_book_data = User::getArrayForUserPageView($str_id);
        
        $user = $user_book_data['user'];
        $follow_data = $user->getFollowsAndFollowersUsers();
        $books_genres = Book::extractGenres($user->books);
        
        $posts = Post::getPostsOfFollowingUsers($user);

        $params = array_merge($user_book_data, $follow_data, compact('posts', 'books_genres'));

        return response()->json($params);
    }
}
