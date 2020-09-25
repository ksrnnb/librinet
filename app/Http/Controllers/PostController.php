<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Requests\PostRequest;
use App\Book;
use App\Post;
use App\Comment;

class PostController extends Controller
{
    public function index(Request $request, $uuid)
    {
        $is_not_uuid = ! Str::isUuid($uuid);

        if ($is_not_uuid) {
            abort('404');
        }

        $post = Post::with(['user', 'comments'])
                    ->where('uuid', $uuid)
                    ->first();

        $books = Book::with('genre')
                     ->where('user_id', Auth::id())
                     ->where('isInBookshelf', true)
                     ->get();
        
        $genres = Book::extractGenres($books);
        $genres_books = $books->groupBy('genre_id');


        return view('post', [
            'post'          => $post,
            'books'         => $books,
            'genres'        => $genres,
            'genres_books'  => $genres_books,
        ]);
    }

    /*   comment (post method)
    *    @param $request->input()
    *    [
    *        'post_id'   => integer,
    *        'message'   => string,
    *        'recommend' => "on" or no set
    *        'book_id'   => integer
    *    ]
    *    @return redirect to home
    */

    public function comment(Request $request)
    {
        $form = request()->except('_token');

        if (isset($form['recommend'])) {
            Comment::create([
                'message' => $form['message'],
                'uuid'    => Str::uuid(),
                'post_id' => $form['post_id'],
                'user_id' => Auth::id(),
                'book_id' => $form['book_id'],
            ]);
        } else {
            Comment::create([
                'message' => $form['message'],
                'uuid'    => Str::uuid(),
                'post_id' => $form['post_id'],
                'user_id' => Auth::id(),
            ]);
        }

        return redirect('/home');
    }

    public function add(Request $request, $isbn)
    {
        $user = Auth::user();
        $params = Book::returnBookInfoOrRedirect($isbn, $user, 'post');

        $is_redirect = ! is_array($params);

        if ($is_redirect) {
            return $params;     // params is redirect
        } else {
            return view('book_post', $params);
        }
    }

    public function create(PostRequest $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);

        if (! $isIsbn) {
            abort('400');
        }

        $form = collect($request->except('_token'));
        $form = $form->merge([
            'isbn'      =>  $isbn,
            'user_id'   =>  Auth::id(),
        ]);
        Post::createNewPost($form);

        return redirect('/home');
    }

    public function remove(Request $request, $uuid)
    {
        if (Str::isUuid($uuid)) {
            $post = Post::where('uuid', $uuid)->first();

            // 削除するポストのユーザーと、認証されているユーザーが一緒かどうか。
            if ($post->user_id == Auth::id()) {
                $post->delete();
            } else {
                abort('400');
            }
        } else {
            abort('400');
        }

        return back();
    }
}
