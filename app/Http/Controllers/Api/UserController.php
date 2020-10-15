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
        } else {
            $params = User::getExampleUsers();
        }
        
        return response($params);
    }

    /**
     * @param array ($request->input('user'): str_id or user_name)
     * @return response array of users
     */
    public function search(SearchUserRequest $request)
    {
        $input = $request->input('user');

        $users = User::searchUsersAndGetUsersProfileData($input);

        return response($users);
    }

    public function show(Request $request, $str_id)
    {
        $user = User::getIdentifiedUserProfileData($str_id);

        // 登録されてないidへのアクセスだった場合
        if ($user == null) {
            return bad_request();
        }

        return response()->json($user);
    }

    // TODO: validation
    public function edit(EditUserRequest $request)
    {
        $validated = $request->validated();
        $params = $request->input('user');
        
        // helper
        $params = extract_user_params($params);

        if (array_key_exists('image', $params)) {
            // helper s3にアップロードして、urlを返す。
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
