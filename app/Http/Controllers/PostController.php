<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Book;


class PostController extends Controller
{
    public function show(Request $request, $isbn)
    {
        $user = Auth::user();

        // TODO: ここ修正する。同じ本を投稿した時、一意じゃない。
        $book = Book::where('isbn', $isbn)
                        ->where('user_id', $user->id)
                        ->first();

        // TODO: 整理する
        if (isset($book)) {
            // $book = $book->toArray();
            // 本棚にあるかどうか
            if ($book['isInBookshelf']) {
                // 本棚に追加ボタンを無効に
            } else {
                // 本棚に追加ボタンを出す
            }
        } else {
            // 本棚に追加ボタンを出す
            // 本の情報を。。。
            // $book = $form;
            // $book['isInBookshelf'] = false;
            
            $book = Book::fetchBook($isbn);
            $book->isInBookshelf = false;
        }
        $genres = Book::extractGenres($user->books);
        // TODO: SQLログ確認する。eagerローディング必要？

        return view('post', ['book' => $book, 'genres' => $genres]);
    }

    public function post(Request $request, $isbn)
    {
        var_dump($isbn);
        var_dump($request->except('_token'));
    }
}
