<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Like;


class LikeController extends Controller
{

    public function like (Request $request)
    {
        $uuid = $request->input('uuid');
        $is_uuid = Str::isUuid($uuid);
        
        if ($is_uuid) {
            
            Like::handleLike($uuid);

        } else {
            // uuidが送られてない場合
            abort('400');
        }

        return back();

    }
}
