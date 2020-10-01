<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Book;
use App\Post;

class UserController extends Controller
{
    public function auth(Request $request)
    {
        // TODO: 認証されてない場合は？？？
        $str_id = Auth::user()->str_id;

        $params = User::getParamsForApp($str_id);

        return response()->json($params);
    }

    public function search(Request $request)
    {
        $user = $request->input('user');
        $users = User::where('str_id', $user)->get();

        // TODO: IDと名前が一致する場合を考慮してない
        // また、部分一致の方がいいのでは？？
        if ($users->isEmpty()) {
            $users = User::where('name', $user)->get();
        }
        
        // 見つからない場合は空の配列を返す。
        if ($users->isEmpty()) {
            return response()->json([]);
        }

        return response()->json($users);
    }
}
