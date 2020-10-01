<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Book;

class PostController extends Controller
{
    public function add(Request $request, $isbn)
    {
        $user = Auth::user();
        $params = Book::returnBookInfoOrRedirect($isbn, $user, 'post');

        if ($params) {
            return response()->json($params);     // params is redirect
        } else {
            abort('400');
            // return response($status = 404);
            // return view('book_post', $params);
        }
    }
}
