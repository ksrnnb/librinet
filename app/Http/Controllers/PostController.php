<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Book;
use App\Post;
use App\Comment;


class PostController extends Controller
{
    public function index (Request $request, $uuid)
    {
        $is_not_uuid = ! Str::isUuid($uuid);

        // TODO: エラーページ？
        if ($is_not_uuid) {
            return redirect('/');
        }

        $posts = Post::with(['user', 'comments'])->get();
        $post = $posts->where('uuid', $uuid)->first();

        $books = Book::with('genre')->get();
        $books = $books->where('user_id', Auth::id())
                       ->where('isInBookshelf', true);
        
        $genres = Book::extractGenres($books);
        $genres_books = $books->groupBy('genre_id');

        return view('post', [
            'post'          => $post,
            'books'         => $books,
            'genres'        => $genres,
            'genres_books'  => $genres_books,
        ]);
    }


    /* comment (post method)
        @param $request->input()
        [
            'post_id'   => integer,
            'message'   => string,
            'recommend' => "on" or no set
            'book_id'   => integer
        ]
        @return redirect to home
    */

    public function comment (Request $request)
    {
        $form = request()->except('_token');

        if (isset($form['recommend'])) {
            Comment::create([
                'message' => $form['message'],
                'post_id' => $form['post_id'],
                'user_id' => Auth::id(),
                'book_id' => $form['book_id'],
            ]);
        } else {
            Comment::create([
                'message' => $form['message'],
                'post_id' => $form['post_id'],
                'user_id' => Auth::id(),
            ]);
        }

        return redirect('/home');
        
    }
}
