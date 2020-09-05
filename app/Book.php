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
}
