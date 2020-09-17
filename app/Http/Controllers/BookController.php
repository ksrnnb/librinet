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
        // TODO： なんでISBN?　確認する
        if (isset($isbn)) {
            $book = Book::fetchBook($isbn);

            return view('book', ['book' => $book]);
        } else {
            return view('book');
        }
    }

    public function search (BookRequest $request)
    {
        $request->validated();

        $isbn = $request->input('isbn');

        return redirect()->route('book', ['isbn' => $isbn]);
    }

    public function show (Request $request, $isbn)
    {
        // みつからない場合はnullが返る
        $book = Book::fetchBook($isbn);

        if ($book == null) {
            $message = '本がみつかりませんでした';
            return view('book', ['cannot_fetch_message' => $message]);
        } else {
            return view('book', ['book' => $book]);
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
