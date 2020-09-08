<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{

    public function user() {
        return $this->hasOne('App\User');
    }

    public function post() {
        return $this->hasOne('App\Post');
    }

    public function genre() {
        return $this->belongsTo('App\Genre');
    }

    public function registerPost($message = '') {
        $this->post()->create([
            'message' => $message,
            'user_id' => $this->user_id,
        ]);
    }

    /*
        fetch book object from openBD
        main property: 'isbn', 'title', 'cover', 'author'
    */
    public static function fetchBook($isbn) {
        $ch = curl_init('https://api.openbd.jp/v1/get?isbn=' . $isbn);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);       
        $book = json_decode(curl_exec($ch))[0]->summary;

        return $book;
    }

    /*
        booksが属するgenresのgenre_idとnameの配列を返す
        return ['id' => 'name', 'id' => 'name, ...]
    */

    //  TODO: groupByで簡潔にならないか？
    //  TODO: 一冊のときでも大丈夫かどうか気になる。確認する。
    public static function extractGenres($books) {

        $genres = [];
        
        foreach($books as $book) {
            
            $new_genre = $book->genre()->first();
            $is_not_exist = true;
            
            foreach ($genres as $genre => $index) {
                if ($index == $new_genre->id) {
                    $is_not_exist = false;
                }
            }
            if ($is_not_exist) {
                $genres[$new_genre->id] = $new_genre->name;
            }

        };

        return $genres;
    }

}
