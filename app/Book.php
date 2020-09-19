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

    public function registerPost($message = '')
    {
        $this->post()->create([
            'message' => $message,
            'uuid' => Str::uuid(),
            'user_id' => $this->user_id,
        ]);
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
        foreach($books as $book) {
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

    // 13桁のISBNかどうかをチェックする
    public static function isIsbn($isbn)
    {
        $isbn = preg_replace('/-/', '', $isbn);
        
        // 返り値は一致すれば1, 一致しない場合は0, errorの場合はFALSE
        $isIsbn = (boolean) preg_match('/^9784[0-9]{9}$/', $isbn);

        return $isIsbn;
    }

    /*
        argument $form
        [
            'add-book'  =>  1 or nothing,
            'genre'     =>  'new' or 'conventional' or nothing,
            'new_genre' =>  'genre_name' or nothing,
            'message'   =>  'message...',
            'title'     =>  'title',
            'author'    =>  'author',
            'cover'     =>  'cover',
            'publisher' =>  'publisher',
            'pubdate'   =>  'pubdate',
            'isbn'      =>  'isbn'
            'user_id'   =>  ingeger
        ]
    */
    public static function createNewBook($form)
    {
        // 新しく本棚に追加
        if ($form->get('add-book')) {
    
            $book_data = $form->merge([
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
                'isInBookshelf' => false,
            ]);
        }

        $book_data = $book_data->except('add-book', 'genre', 'new_genre', 'message');

        $book = Book::create($book_data->toArray());

        return $book;
    }
}
