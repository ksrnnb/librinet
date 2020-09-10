<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Book;

class UserController extends Controller
{
    public function index(Request $request, $str_id) {

        // \DB::enableQueryLog();

        $users = User::with('books.genre')->get();          // Eager loading
        $user = $users->where('str_id', $str_id)->first();  // select user
        $books = $user->books;
        $genres = Book::extractGenres($books);
        $genres_books_collection = $books->groupBy('genre_id');

        // dd(\DB::getQueryLog());
            
        return view('user', [
            'user' => $user,
            'books' => $books,
            'genres' => $genres,
            'genres_books_collection' => $genres_books_collection,
        ]);
    }
}
