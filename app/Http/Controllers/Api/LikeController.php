<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like(Request $request)
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
