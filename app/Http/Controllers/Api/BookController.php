<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Book;
use App\Genre;
use App\User;

class BookController extends Controller
{
    public function search(BookRequest $request)
    {
        // $request->validated();
        // TODO: Validate独自に？

        $isbn = $request->input('isbn');
        $book = Book::fetchBook($isbn);

        if ($book == null) {
            return response('Cannot Search', 404);
        }

        $user = Auth::user();

        if ($user) {
            $isInBookshelf = $user->hasBook($isbn);
            // falseはcompact関数に使えない
            $book->isInBookshelf = $isInBookshelf;
        }

        return response()->json($book);
    }

    /**
    *   @param $request->input():
    *       _token    => string,
    *       isbn      => string,
    *       title     => string,
    *       author    => string,
    *       cover     => string(URL),
    *       publisher => string,
    *       pubdate   => string,
    *       genre     => "new" or "conventional",
    *       new_genre => "input genre name" (the case selecting new genre)
    *       genre_id  => integer (the case selecting conventional genre)
    *
    *   @return array
    */
    // TODO: validation Bookcreaterequest?
    public function create(Request $request)
    {
        Gate::authorize('create-book');

        $form = collect($request->input());
        $user = Auth::user();
        $form = $form->merge([
            'user_id'   =>  $user->id,
        ]);

        // TODO: このへんはNewBookCreateから
        $book_data = $form->merge([
            'isInBookshelf' => true,
        ]);

        // 新しいジャンルを作る場合
        if ($form->get('is_new_genre') == 'new') {
            $genre = Genre::create(['name' => $form->get('new_genre')]);

            $book_data = $book_data->merge(['genre_id' => $genre->id]);
        } else {
            // 既存のジャンルの場合は、既にジャンルIDが入っている
        }

        $book_data = $book_data->except(
            'add_to_bookshelf',
            'is_new_genre',
            'message',
            'new_genre',
        );

        $book = Book::create($book_data->toArray());
        $params = Book::getBooksAndGenres($user->str_id);

        return response($params);
    }

    public function delete(Request $request)
    {
        $ids = $request->ids;
        $user = Auth::user();
        // deleteBooksメソッドの中でGateを利用して認可の処理をしている。
        Book::deleteBooks($ids, $user);

        $params = User::getParamsForApp($user->str_id);

        return response()->json($params);
    }
}
