<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Book;

class UserController extends Controller
{
    public function index(Request $request, $str_id)
    {

        $users = User::with('books.genre')->get();              // Eager loading
        $user = $users->where('str_id', $str_id)->first();      // select user
        $books = $user->books->where('isInBookshelf', true);    // 本棚に追加した本だけを抽出
        $genres = Book::extractGenres($books);
        $genres_books_collection = $books->groupBy('genre_id');
        /*
            genres:                  [genre_id => genre_name, ...]
            genres_books_collection: [[genre_id => [book, book, ...]], ...]
        */
        
        return view('user', [
            'user' => $user,
            'books' => $books,
            'genres' => $genres,
            'genres_books_collection' => $genres_books_collection,
        ]);
        
    }
}
