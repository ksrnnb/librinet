<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Like;


class LikeController extends Controller
{
    public function like (Request $request, $uuid)
    {
        $is_uuid = Str::isUuid($uuid);
        
        if ($is_uuid) {
            
            Like::handleLike($uuid);

        // TODO：エラーにとばす？　（uuidが送られてない場合）
        } else {
            return back();
        }

        return back();

    }
}
