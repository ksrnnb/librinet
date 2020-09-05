<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Book;

class UserController extends Controller
{
    public function index(Request $request, $str_id) {

        $user = User::where('str_id', $str_id)->first();
        $books = $user->books;

        $genres = Book::extract_genres($books);

        // TODO: 不要なカラムは除きたい。
        //       user_idが欲しいからonlyメソッド使うなら後がいい。
        // $user = $user->only('str_id', 'name', 'email', 'image');

        return view('user', ['user' => $user, 'books' => $books, 'genres' => $genres]);
    }
}
