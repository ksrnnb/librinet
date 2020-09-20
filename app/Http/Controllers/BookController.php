<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookRequest;
use App\Book;
use App\Post;
use App\User;
use App\Genre;
use Illuminate\Support\Facades\Auth;


class BookController extends Controller
{
    public function index (Request $request)
    {
        return view('book.index');
    }

    public function search (BookRequest $request)
    {
        $request->validated();

        $isbn = $request->input('isbn');

        return redirect()->route('book', ['isbn' => $isbn]);
    }

    public function show (Request $request, $isbn)
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

    public function add (Request $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);
        $user = Auth::user();

        if ($isIsbn) {
            // TODO: ここ修正する。PostControllerのaddとほぼ同じ処理
            $books = Book::where('isbn', $isbn)
                         ->where('user_id', $user->id)
                         ->get();

            $do_books_exist = $books->isNotEmpty();

            if ($do_books_exist) {
                        
                $is_in_bookshelf = $books->contains('isInBookshelf', true);

                // Error 本棚に本があったら追加できない。
                if ($is_in_bookshelf) {
                    return back();
                } else {
                    $book = $books->first();
                }

            } else {
                
                $book = Book::fetchBook($isbn);

                // 本がみつからなかった場合はnullが返るようにしている。
                if ($book != null) {
                    $book->isInBookshelf = false;
                }
            }

            $genres = Book::extractGenres($user->books);

            return view ('book.add', ['book' => $book, 'genres' => $genres]);
        // TODO: error page
        } else {
            return back();
        }
    }

    public function create (Request $request, $isbn)
    {
        // TODO: 整理する。ほぼPostControllerと一緒
        $isIsbn = Book::isIsbn($isbn);

        // TODO: エラーページに飛ばす？
        if (! $isIsbn) {
            return redirect('/');
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

        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
        }
    }

    public function update(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $genres = request()->except('_token');
            $table = Genre::whereIn('id', array_keys($genres))->get();

            foreach($table as $genre) {
                $query = ['name' => $genres[$genre->id]];
                $genre->fill($query)->save();
            }
            
            return redirect('/user/show/' . $str_id);

        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
        }
    }


    public function delete(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $params = User::getArrayForUserPageView($str_id);

            return view('book.delete', $params);

        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
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
        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
        }
    }

}
