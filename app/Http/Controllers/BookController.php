<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookRequest;
use App\Http\Requests\PostRequest;
use App\Book;
use App\Post;
use Illuminate\Support\Facades\Auth;


class BookController extends Controller
{
    public function index (Request $request)
    {
        if (isset($isbn)) {
            $book = Book::fetchBook($isbn);

            return view('book', ['book' => $book]);
        } else {
            return view('book');
        }
    }

    public function search (BookRequest $request)
    {
        var_dump($request->validated());

        $isbn = $request->input('isbn');

        return redirect()->route('book', ['isbn' => $isbn]);
    }

    public function show (Request $request, $isbn)
    {
        if (Book::isIsbn($isbn)) {
            $book = Book::fetchBook($isbn);

            return view('book', ['book' => $book]);
        } else {
            return redirect('/book');
        }

    }

    public function post (Request $request)
    {
        return redirect()->route('book_post', ['isbn' => $request->input('isbn')]);
    }

    public function create (Request $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);
        if (! $isIsbn) {
            return redirect('/');
        }
        
        $user = Auth::user();

        // TODO: ここ修正する。同じ本を投稿した時、一意じゃない。
        $book = Book::where('isbn', $isbn)
                        ->where('user_id', $user->id)
                        ->first();
        
        if (isset($book)) {

        } else {
            $book = Book::fetchBook($isbn);
            $book->isInBookshelf = false;
        }
        $genres = Book::extractGenres($user->books);
        // TODO: SQLログ確認する。eagerローディング必要？
        return view('book_post', ['book' => $book, 'genres' => $genres]);
    }

    public function add (PostRequest $request, $isbn)
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