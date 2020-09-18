<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookRequest;
use App\Http\Requests\PostRequest;
use App\Book;
use App\Post;
use App\User;
use App\Genre;
use Illuminate\Support\Facades\Auth;


class BookController extends Controller
{
    public function index (Request $request)
    {
        // TODO： なんでISBN?　確認する
        if (isset($isbn)) {
            $book = Book::fetchBook($isbn);

            return view('book', ['book' => $book]);
        } else {
            return view('book');
        }
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
            return view('book', ['cannot_fetch_message' => $message]);
        } else {
            return view('book', ['book' => $book]);
        }
    }

    public function post (Request $request)
    {
        return redirect()->route('book_post', ['isbn' => $request->input('isbn')]);
    }

    public function create (Request $request, $isbn)
    {
        $isIsbn = Book::isIsbn($isbn);
        if (! $isIsbn) {
            return redirect('/');
        }
        
        $user = Auth::user();

        if ($user == null) {
            return redirect('/');
        } 

        // TODO: ここ修正する。同じ本を投稿した時、一意じゃない。
        $books = Book::where('isbn', $isbn)
                    ->where('user_id', $user->id)
                    ->get();

        $books_exist = $books->isNotEmpty();

        if ($books_exist) {
                        
            $is_in_bookshelf = $books->contains('isInBookshelf', true);
            
            if ($is_in_bookshelf) {
                $book = $books->where('isInBookshelf', true)->first();
            } else {
                $book = $books->first();
            }
                        
        } else {
            $book = Book::fetchBook($isbn);
            
            // 本がなかった場合はnullが返るようにしている。
            if ($book != null) {
                $book->isInBookshelf = false;
            }
        }
        $genres = Book::extractGenres($user->books);
        // TODO: SQLログ確認する。eagerローディング必要？
        return view('book_post', ['book' => $book, 'genres' => $genres]);
    }

    public function add (PostRequest $request, $isbn)
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

    public function edit(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $params = User::getArrayForUserPageView($str_id);

            return view('book_edit', $params);

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
            
            return redirect('/user/' . $str_id);

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

            return view('book_edit', $params);

        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
        }
    }



    public function remove(Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {
            $books_id = array_keys(request()->except('_token'));

            $books = Book::with(['post' => function($query) use ($user) {
                $query->where('user_id', $user->id);
            }])->get();

            // TODO: ジャンルに属する本がなくなったら、ジャンルも消したい。
            foreach($books_id as $id) {
                $book = $books->where('id', $id)->first();

                // TODO:　本棚にあるけどPOSTに関連付けがない状態ができたら修正する
                $doesRelatePost = true;
                if ($doesRelatePost) {
                    // POSTに関連づけがある場合は本棚からなくすだけ。
                    $book->isInBookshelf = false;
                    $book->save();
                } else {
                    // POSTに関連付けがなかったばあいは削除。現状は必ず結びついている
                    $book->delete();
                }

            }

            return redirect('/user/' . $str_id);
        // TODO：認証されているIDと編集しようとしているIDが違う場合、どこに飛ばすか
        } else {
            return redirect('/');
        }
    }

}
