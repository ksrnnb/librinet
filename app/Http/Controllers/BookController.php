<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;
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

    public function search (Request $request)
    {
        $isbn = $request->input('isbn');

        return redirect()->route('book', ['isbn' => $isbn]);
    }

    public function show (Request $request, $isbn)
    {
        // TODO: validation
        if (isset($isbn)) {
            $book = Book::fetchBook($isbn);

            return view('book', ['book' => $book]);
        } else {
            return view('book');
        }

    }

    public function post (Request $request)
    {
        // $user_id = Auth::id();

        // $form = $request->only('isbn', 'title', 'author', 'cover');

        // $book = Book::where('isbn', $form['isbn'])
        //                 ->where('user_id', $user_id)
        //                 ->first();

        // if (isset($book)) {
        //     $book = $book->toArray();
        //     // 本棚にあるかどうか
        //     if ($book['isInBookshelf']) {
        //         // 本棚に追加ボタンを無効に
        //     } else {
        //         // 本棚に追加ボタンを出す
        //     }
        // } else {
        //     // 本棚に追加ボタンを出す
        //     // 本の情報を。。。
        //     $book = $form;
        //     $book['isInBookshelf'] = false;

        // }
        
        return redirect()->route('post', ['isbn' => $request->input('isbn')]);
        // return view('post', ['book' => $book]);



    }
}
