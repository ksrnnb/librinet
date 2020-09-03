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
}
