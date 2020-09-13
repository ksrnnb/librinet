<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Book;
use App\Genre;
use App\Post;


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
        // TODO：validation
        $user = Auth::user();
        $form = collect($request->except('_token'));


        // 新しく本棚に追加
        if ($form->get('add')) {
    
            $book_data = $form->merge([
                'user_id' => Auth::id(),
                'isbn' => $isbn,
                'isInBookshelf' => true,
            ]);

            // 新しいジャンルを作る場合
            if ($form->get('genre') == 'new') {
                $genre = Genre::create(['name' => $form->get('new_genre')]);
    
                $book_data = $book_data->merge(['genre_id' => $genre->id]);
            } else {
                // 既存のジャンルの場合は、既にジャンルIDが入っている
            }

        } else {
            $book_data = $form->merge([
                'user_id' => Auth::id(),
                'isbn' => $isbn,
                'isInBookshelf' => false,
            ]);
        }

        $book_data = $book_data->except('add', 'genre', 'new_genre', 'message');

        $book = Book::create($book_data->toArray());

        $post_data = [
            'user_id' => $book->user_id,
            'book_id' => $book->id,
            'message' => $form->get('message'),
        ];
        
        Post::create($post_data);

        return redirect('/');

    }
}
