<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookRequest;
use App\Http\Requests\BookCreateRequest;
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
    *       isbn      => string,
    *       title     => string,
    *       author    => string,
    *       cover     => string(URL),
    *       publisher => string,
    *       pubdate   => string,
    *       genre     => "new" or "conventional",
    *       new_genre => "input genre name" (the case selecting new genre)
    *       genre_id  => int (the case selecting conventional genre)
    *   @return array
    */
    public function create(BookCreateRequest $request)
    {
        Gate::authorize('create-book');

        $form = collect($request->input());

        // 新しいジャンルを作る場合
        if ($form->get('is_new_genre') == true) {
            \Log::debug('creating');
            $genre = Genre::create(['name' => $form->get('new_genre')]);

            $form = $form->merge(['genre_id' => $genre->id]);
        }

        $book = Book::create($form->toArray());
        $params = Book::getBooksAndGenres(Auth::user()->str_id);

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
