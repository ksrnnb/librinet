<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Book;

class UserController extends Controller
{
    public function index(Request $request, $str_id) {

        $user = User::where('str_id', $str_id)->first();
        //  user_idが欲しいからonlyメソッド使うなら後がいい。
        $books = Book::where('user_id', $user->id)->get();
        
        //TODO: 不要なカラムは除きたい。
        // $user = $user->only('str_id', 'name', 'email', 'avatar_img');

        return view('user', ['user' => $user, 'books' => $books]);
    }
}
