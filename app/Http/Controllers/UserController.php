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

        $users = User::with(['books.genre'])->get();
        $user = $users->where('str_id', $str_id)->first();      // select user
        $books = $user->books->where('isInBookshelf', true);    // 本棚に追加した本だけを抽出
        $genres = Book::extractGenres($books);
        $genres_books = $books->groupBy('genre_id');
        /*
            genres:                  [genre_id => genre_name, ...]
            genres_books: [[genre_id => [book, book, ...]], ...]
        */

        // TODO：整理。ここはフォローしているかどうかの判定
        $is_following = false;
        $viewer_id = Auth::id();

        $f_table = Follower::all();
        $viewer_followings = $f_table->where('follower_id', $viewer_id);
        
        if ($viewer_followings->isNotEmpty()) {
            $is_following = $viewer_followings->groupBy('follow_id')
                                              ->has($user->id);
        }

        // フォロー数、フォロワー数を取得
        $follows = $f_table->where('follower_id', $user->id)->count();
        $followers = $f_table->where('follow_id', $user->id)->count();
        
        return view('user', [
            'user' => $user,
            'books' => $books,
            'genres' => $genres,
            'genres_books' => $genres_books,
            'is_following' => $is_following,
            'follows' => $follows,
            'followers' => $followers,
        ]);
        
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

        if ($users->isEmpty()) {
            $users = User::where('name', $user)->get();
        }
        
        return view('user_search', ['users' => $users]);
    }
    
}
