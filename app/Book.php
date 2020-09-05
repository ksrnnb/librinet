<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    public function user() {
        return $this->hasOne('App\User');
    }

    public function book() {
        return $this->hasOne('App\Book');
    }

    public function post() {
        return $this->hasOne('App\Post');
    }

    public function genre() {
        return $this->belongsTo('App\Genre');
    }

    public function register_post($message = '') {
        $this->post()->create([
            'message' => $message,
            'user_id' => $this->user_id,
        ]);
    }

    /*
        fetch book object from openBD
        main property: 'isbn', 'title', 'cover', 'author'
    */
    public static function fetch_book($isbn) {
        $ch = curl_init('https://api.openbd.jp/v1/get?isbn=' . $isbn);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);       
        $book = json_decode(curl_exec($ch))[0]->summary;

        return $book;
    }

    /*
        booksが属するgenresのgenre_idとnameの配列を返す
        return [['id' => 'name'], ['id' => 'name], ...]
    */

    //  TODO: 一冊のときでも大丈夫かどうか気になる。確認する。
    public static function extract_genres($books) {
        $genres = [];
        foreach($books as $book) {
            
            $new_genre = $book->genre()->first()->toArray();

            $is_not_exist = true;
            foreach ($genres as $genre) {
                if ($genre['id'] == $new_genre['id']) {
                    $is_not_exist = false;
                }
            }
            if ($is_not_exist) {
                $genres[] = $new_genre;
            }

        };

        return $genres;
    }

}
