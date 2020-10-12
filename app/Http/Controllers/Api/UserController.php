<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\EditUserRequest;
use App\Http\Requests\SearchUserRequest;
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

    /**
     * @param array ($request->input('user'): str_id or user_name)
     * @return response array of users
     */
    public function search(SearchUserRequest $request)
    {
        $input = $request->input('user');

        $users = User::getUsersProfileData($input);

        return response($users);
    }

    public function show(Request $request, $str_id)
    {
        $params = User::getUserBooksGenres($str_id);

        // 登録されてないidへのアクセスだった場合
        if ($params == null) {
            return bad_request();
        }

        // $user = Auth::user();

        // if ($user) {
        //     $viewer_user = $user;
        //     $params = array_merge($params, compact('viewer_user'));
        // }

        $user = $params['user'];
        $follow_data = $user->getFollowsAndFollowersUsers();

        $params = array_merge($params, $follow_data);

        return response()->json($params);
    }

    // TODO: validation
    public function edit(EditUserRequest $request)
    {
        $validated = $request->validated();
        $params = $request->input('user');
        
        // helper
        $params = extract_user_params($params);

        if (array_key_exists('image', $params)) {
            // helper / s3にアップロードして、urlを返す。
            $params['image'] = upload_image_s3($params['image']);
        }

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
