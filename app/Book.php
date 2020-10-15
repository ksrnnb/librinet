<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Book extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function post()
    {
        return $this->hasOne('App\Post');
    }

    public function genre()
    {
        return $this->belongsTo('App\Genre');
    }

    // 削除時の動作をオーバーライド
    public function delete()
    {
        $genre_id = $this->genre_id;

        parent::delete();

        $doesnt_exist_genre_id = Book::where('genre_id', $genre_id)->doesntExist();

        if ($doesnt_exist_genre_id) {
            // 削除した本のジャンルが、1冊もない場合
            Genre::find($genre_id)->delete();
        }
    }

    /*
        @param $form
        [
            'add_to_bookshelf'  =>  boolean
            'is_new_genre'      =>  boolean,
            'new_genre'         =>  'genre_name' or empty string "",
            'message'           =>  'message...',
            'title'             =>  'title',
            'author'            =>  'author',
            'cover'             =>  'cover',
            'publisher'         =>  'publisher',
            'pubdate'           =>  'pubdate',
            'isbn'              =>  'isbn'
            'user_id'           =>  ingeger
            'genre_id'          => integer
        ]

        @return App\Book
    */

    public static function createNewBook($form)
    {
        // 新しく本棚に追加
        if ($form['add_to_bookshelf']) {
            $book_data = $form->merge([
                'isInBookshelf' => true,
            ]);

            // 新しいジャンルを作る場合
            if ($form['is_new_genre']) {
                $genre = Genre::create(['name' => $form['new_genre']]);
    
                $book_data = $book_data->merge(['genre_id' => $genre->id]);
            } else {
                // 既存のジャンルの場合は、既にジャンルIDが入っているので処理は不要
            }
        } else {
            $book_data = $form->merge([
                'isInBookshelf' => false,
            ]);
        }

        $book_data = $book_data->except(
            'add_to_bookshelf',
            'is_new_genre',
            'new_genre',
            'message'
        );

        $book = Book::create($book_data->toArray());

        return $book;
    }

    public static function deleteBooks($books_ids, $user)
    {
        // 選択した本のIDだけ取得
        $ids = array_map('\App\Book::selectedIds', $books_ids);

        $books = Book::with(['post' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])->get();

        foreach ($ids as $id) {
            $book = $books->where('id', $id)->first();

            $RelatesPost = $book->post instanceof Post;

            if ($RelatesPost) {
                // POSTに関連づけがある場合は本棚からなくすだけ。
                $book->isInBookshelf = false;
                $book->save();
            } else {
                // POSTに関連付けがなかったばあいは削除。
                $book->delete();
            }
        }
    }

    /*
        fetch book object from openBD
        main property: 'isbn', 'title', 'cover', 'author'
    */
    public static function fetchBook($isbn)
    {
        $ch = curl_init('https://api.openbd.jp/v1/get?isbn=' . $isbn);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $result = json_decode(curl_exec($ch))[0];
        curl_close($ch);

        if ($result == null) {
            return null;
        } else {
            $book = $result->summary;
            return $book;
        }
    }

    /*
        @param $books:
        booksが属するgenresのgenre_idとnameの配列を返す
        return ['id' => 'name', 'id' => 'name, ...]
    */
    public static function extractGenres($books)
    {
        $genres = [];
        
        //  一冊のときでも想定どおりに処理できている。
        foreach ($books as $book) {
            $genre = $book->genre;

            // genre_idがnullの場合もあるので確認している。
            if (isset($genre)) {
                if (array_key_exists($genre->id, $genres)) {
                } else {
                    $genres[$genre->id] = $genre->name;
                }
            }
        }

        return $genres;
    }

    public static function getGenresAndOrderedBooks($books)
    {
        if ($books->isNotEmpty()) {
            $books = $books->where('isInBookshelf', true);    // 本棚に追加した本だけを抽出
            $genres = Book::extractGenres($books);
            $ordered_books = $books->groupBy('genre_id');

            /*
                genres:                  [genre_id => genre_name, ...]
                ordered_books: [[genre_id => [book, book, ...]], ...]
            */
            return [$genres, $ordered_books];
        } else {
            return [[], []];
        }
    }

    /**
    *   @param $str_id: string
    *   @return $params or null
    */
    public static function getBooksAndGenres(string $str_id)
    {
        $users = User::with(['books.genre'])->get();
        $user = $users->where('str_id', $str_id)->first();      // select user

        if ($user) {
            $books = $user->books->where('isInBookshelf', true);    // 本棚に追加した本だけを抽出
            $genres = Book::extractGenres($books);
            $ordered_books = $books->groupBy('genre_id');
            /*
                genres:                  [genre_id => genre_name, ...]
                orderedbooks: [[genre_id => [book, book, ...]], ...]
            */
            $params = [
                // 'user' => $user,
                'books' => $books,
                'genres' => $genres,
                'ordered_books' => $ordered_books,
            ];
    
            return $params;
        // ユーザーが見つからない場合はnullを返す
        } else {
            return null;
        }
    }

    // 13桁のISBNかどうかをチェックする
    public static function isIsbn(string $isbn): bool
    {
        $isbn = preg_replace('/-/', '', $isbn);
        
        // 返り値は一致すれば1, 一致しない場合は0, errorの場合はFALSE
        $isIsbn = (bool) preg_match('/^9784[0-9]{9}$/', $isbn);

        return $isIsbn;
    }

    public static function selectedIds($books_id)
    {
        $delimiter = '-';

        return explode($delimiter, $books_id)[1];
    }

    public function registerPost($message = '')
    {
        $this->post()->create([
            'message' => $message,
            'uuid'    => Str::uuid(),
            'user_id' => $this->user_id,
        ]);
    }

    public static function returnBookInfoOrRedirect($isbn, $user, $model)
    {
        $is_not_isbn = ! Book::isIsbn($isbn);

        if ($is_not_isbn) {
            // ISBN以外の値をURLに直接入力しない限り、ここにこない。
            abort('404');
        }
        
        if ($user == null) {
            // トップページへ飛ばす
            return redirect('/');
        }

        $books = Book::where('isbn', $isbn)
                     ->where('user_id', $user->id)
                     ->get();

        $exists_books_in_db = $books->isNotEmpty();

        if ($exists_books_in_db) {
            $is_in_bookshelf = $books->contains('isInBookshelf', true);

            if ($is_in_bookshelf) {
                if ($model == 'book') {
                    // 本棚に本があったら、このページには来れない。
                    abort('400');
                } elseif ($model == 'post') {
                    // 本棚に本がある場合に、その本を投稿する
                    $book = $books->where('isInBookshelf', true)->first();
                }
            } else {
                // 本棚に本がない場合
                $book = $books->first();
            }
        // データベースにない場合
        } else {
            $book = Book::fetchBook($isbn);

            if ($book != null) {
                // 本がISBNでみつけられたら
                $book->isInBookshelf = false;
            } else {
                // 追加ボタンからきているからISBNで必ずみつかるはず
                abort('400');
            }
        }
        $genres = Book::extractGenres($user->books);
        $params = ['genres' => $genres, 'book' => $book];

        return $params;
    }

    public static function getBookParams($isbn, $genre_id = 1, $has_book = true)
    {
        $book = Book::fetchBook($isbn);

        $params = [
            'isbn'          => $isbn,
            'title'         => $book->title,
            'author'        => $book->author,
            'cover'         => $book->cover,
            'publisher'     => $book->publisher,
            'pubdate'       => $book->pubdate,
            'genre_id'      => $genre_id,         //     1: IT (GenreSeederで作成する)
            'isInBookshelf' => $has_book,    //  true: 自分の本棚
        ];

        return $params;
    }
}
