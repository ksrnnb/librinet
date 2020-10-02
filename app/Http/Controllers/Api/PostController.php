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
            return response()->json(['hoge' => 'hoge']);
            // return response($status = 404);
            // return view('book_post', $params);
        }
    }

    public function create(PostRequest $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);

        if (! $isIsbn) {
            abort('400');
        }

        $form = collect($request->except('_token'));
        $form = $form->merge([
            'isbn'      =>  $isbn,
            'user_id'   =>  Auth::id(),
        ]);
        Post::createNewPost($form);

        return redirect('/home');
    }
}
