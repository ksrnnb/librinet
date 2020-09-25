<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookRequest;
use App\Http\Requests\BookCreateRequest;
use App\Book;
use App\Post;
use App\User;
use App\Genre;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    public function index(Request $request)
    {
        return view('book.index');
    }

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
        $isNotInBookshelf = $user->hasBook($isbn);

        $params = [
            'book'              => $book,
            'isNotInBookshelf'  => ! $user->hasBook($isbn),
        ];

        return response()->json(['params' => $params]);
    }

    public function show(Request $request, $isbn)
    {
        // みつからない場合はnullが返る
        $book = Book::fetchBook($isbn);

        if ($book == null) {
            $message = '本がみつかりませんでした';
            return view('book.index', ['cannot_fetch_message' => $message]);
        } else {
            $user = Auth::user();
            $params = [
                'book'              => $book,
                'isNotInBookshelf'  => ! $user->hasBook($isbn),
            ];
            return view('book.index', $params);
        }
    }

    // 本棚に追加するボタンを押したときのアクション
    public function add(Request $request, $isbn)
    {
        $user = Auth::user();
        $params = Book::returnBookInfoOrRedirect($isbn, $user, 'book');
        
        $is_redirect = ! is_array($params);

        if ($is_redirect) {
            return $params;     // params is redirect
        } else {
            return view('book.add', $params);
        }
    }

    /*
    *   @param $request->input():
    *       _token    => string,
    *       title     => string,
    *       author    => string,
    *       cover     => string(URL),
    *       publisher => string,
    *       pubdate   => string,
    *       genre     => "new" or "conventional",
    *       new_genre => "input genre name" (the case selecting new genre)
    *       genre_id  => integer (the case selecting conventional genre)
    *
    *   @return view
    */
    public function create(BookCreateRequest $request, $isbn)
    {
        
        $isIsbn = Book::isIsbn($isbn);
        if (! $isIsbn) {
            //
            return redirect('400');
        }
 
        // $form:   'genre' => 'new' or 'conventional'
        //          'new_genre' => 'genre name' or null
        $form = collect($request->except('_token'));
        $form = $form->merge([
            'isbn'      =>  $isbn,
            'user_id'   =>  Auth::id(),
        ]);
        
        $is_new_genre = $form['genre'] == 'new';
        $is_conv_genre = $form['genre'] == 'conventional';
        
        // TODO: このへんはNewBookCreateから
        $book_data = $form->merge([
            'isInBookshelf' => true,
        ]);

        // 新しいジャンルを作る場合
        if ($form->get('genre') == 'new') {
            $genre = Genre::create(['name' => $form->get('new_genre')]);

            $book_data = $book_data->merge(['genre_id' => $genre->id]);
        } else {
            // TODO: JavaScriptを整理したい。。。
            // 既存のジャンルの場合は、既にジャンルIDが入っている（予定）
        }

        $book_data = $book_data->except('add-book', 'genre', 'new_genre', 'message');

        $book = Book::create($book_data->toArray());

        // TODO: 本棚に追加しましたってわかるようにしたい
        //      リンク先はユーザーページ方がいい？
        return redirect('book');
    }

    public function edit(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $params = User::getArrayForUserPageView($str_id);

            return view('book.edit', $params);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            abort('400');
        }
    }

    public function update(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $genres = request()->except('_token');
            $table = Genre::whereIn('id', array_keys($genres))->get();

            foreach ($table as $genre) {
                $query = ['name' => $genres[$genre->id]];
                $genre->fill($query)->save();
            }
            
            return redirect('/user/show/' . $str_id);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            abort('400');
        }
    }


    public function delete(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $params = User::getArrayForUserPageView($str_id);

            return view('book.delete', $params);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            abort('400');
        }
    }

    public function remove(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            // 右辺: [book_id1 => , book_id2 => , ...]
            $books_ids = array_keys(request()->except('_token'));

            Book::deleteBooks($books_ids, $user);

            return redirect('/user/show/' . $str_id);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            abort('400');
        }
    }
}
