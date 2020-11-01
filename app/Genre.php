<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $guarded = ['id'];

    public $timestamps = false;

    public function books()
    {
        return $this->hasMany('App\Book');
    }
}
