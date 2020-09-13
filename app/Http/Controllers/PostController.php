<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Facades\Auth;
use App\Book;
use App\Genre;
use App\Post;


class PostController extends Controller
{
    public function show(Request $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);
        if (! $isIsbn) {
            return redirect('/');
        }
        
        $user = Auth::user();

        // TODO: ここ修正する。同じ本を投稿した時、一意じゃない。
        $book = Book::where('isbn', $isbn)
                        ->where('user_id', $user->id)
                        ->first();
        
        if (isset($book)) {

        } else {
            $book = Book::fetchBook($isbn);
            $book->isInBookshelf = false;
        }
        $genres = Book::extractGenres($user->books);
        // TODO: SQLログ確認する。eagerローディング必要？
        return view('post', ['book' => $book, 'genres' => $genres]);
    }

    public function post(PostRequest $request, $isbn)
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
