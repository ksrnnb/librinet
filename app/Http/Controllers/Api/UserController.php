<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\EditUserRequest;
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
            $viewer_user = $user;
            $params = array_merge($params, compact('viewer_user'));
        }

        $user = $params['user'];
        $follow_data = $user->getFollowsAndFollowersUsers();

        $params = array_merge($params, $follow_data);

        return response()->json($params);
    }

    // TODO: validation
    public function edit(EditUserRequest $request)
    {
        $params = $request->input('user');
        
        // helper
        $params = extract_user_params($params);

        User::updateUser($params);

        return response('updated', 200);
    }

    public function delete(Request $request)
    {
        $user = Auth::user();

        if ($request->id == $user->id) {
            $user->delete();
            return response('deleted', 200);
        } else {
            return bad_request();
        }
    }
}
