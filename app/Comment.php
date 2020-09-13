<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $guarded = ['id'];

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    public function likes()
    {
        return $this->hasMany('App\Like');
    }

    public function book()
    {
        return $this->belongsTo('App\Book', 'book_id', 'id');
        // return $this->hasOne('App\Book', 'id', 'book_id');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
