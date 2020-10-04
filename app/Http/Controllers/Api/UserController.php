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
    // 現在認証しているユーザーを取得する
    public function auth(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $params = User::getParamsForApp($user->str_id);

            return response()->json($params);
        } else {
            // ログインしていない場合でも、
            // 特定のページに行かなければ問題はないので200番にした
            return response('Not Authenticated.', 200);
        }
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

    public function show(Request $request, $str_id)
    {
        $params = User::getUserBooksGenres($str_id);

        // 登録されてないidへのアクセスだった場合
        if ($params == null) {
            return response('Bad Request', 400);
        }

        $user = Auth::user();

        if ($user) {
            $viewer_str_id = $user->str_id;
            $params = array_merge($params, compact('viewer_str_id'));
        }

        $user = $params['user'];
        $follow_data = $user->getFollowsAndFollowersUsers();

        $params = array_merge($params, $follow_data);

        return response()->json($params);
    }
}
