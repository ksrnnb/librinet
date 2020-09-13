<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookRequest;
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
        return redirect()->route('post', ['isbn' => $request->input('isbn')]);
    }
}
