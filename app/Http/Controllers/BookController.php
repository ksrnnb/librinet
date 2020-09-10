<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Book;

class BookController extends Controller
{
    public function index (Request $request, $isbn = null) {
        if (isset($isbn)) {
            $book = Book::fetchBook($isbn);
            
            return view('book', ['book' => $book]);
        } else {
            return view('book');
        }
    }

    public function search (Request $request) {
        $isbn = $request->input('isbn');

        return redirect()->route('book', ['isbn' => $isbn]);
    }

}
