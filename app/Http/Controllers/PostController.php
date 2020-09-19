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

    public function add (Request $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);
        if (! $isIsbn) {
            return redirect('/');
        }
        
        $user = Auth::user();

        if ($user == null) {
            return redirect('/');
        } 

        // TODO: ここ修正する。同じ本を投稿した時、一意じゃない。
        $books = Book::where('isbn', $isbn)
                    ->where('user_id', $user->id)
                    ->get();

        $books_exist = $books->isNotEmpty();

        if ($books_exist) {
                        
            $is_in_bookshelf = $books->contains('isInBookshelf', true);
            
            if ($is_in_bookshelf) {
                $book = $books->where('isInBookshelf', true)->first();
            } else {
                $book = $books->first();
            }
                        
        } else {
            $book = Book::fetchBook($isbn);
            
            // 本がなかった場合はnullが返るようにしている。
            if ($book != null) {
                $book->isInBookshelf = false;
            }
        }
        $genres = Book::extractGenres($user->books);
        // TODO: SQLログ確認する。eagerローディング必要？
        return view('book_post', ['book' => $book, 'genres' => $genres]);
    }

    public function create (PostRequest $request, $isbn)
    {
        $request->validated();
        
        $isIsbn = Book::isIsbn($isbn);

        // TODO: エラーページに飛ばす？
        if (! $isIsbn) {
            return redirect('/');
        }

        $form = collect($request->except('_token'));
        $form = $form->merge([
            'isbn'      =>  $isbn,
            'user_id'   =>  Auth::id(),
        ]);

        Post::createNewPost($form);

        return redirect('/');

    }
}
