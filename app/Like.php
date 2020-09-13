<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $guarded = ['id'];
    
    public function comment()
    {
        return $this->belongsTo('App\Comment');
    }

    public function post()
    {
        return $this->belongsTo('App\Post');
    }
}
