<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Storage;
use App\User;
use App\Book;
use App\Follower;
use Validator;

class UserController extends Controller
{
    // public function index(Request $request, $str_id)
    // {
    //     $user = User::where('str_id', $str_id)->get();
    
    //     if ($user->isEmpty()) {
    //         // 削除してもどってここにきて更新すると$userはnull
    //         return redirect('/');
    //     }

    //     $user_book_data = User::getArrayForUserPageView($str_id);

    //     $viewer_id = Auth::id();
    //     $user = $user_book_data['user'];
    //     $follow_data = Follower::getFollowDataForUserPageView($user, $viewer_id);
        
    //     $params = array_merge($user_book_data, $follow_data);

    //     // return view('user.index', $params);
    //     return response()->json($params);
    // }

    public function edit(Request $request, $str_id)
    {
        
        $showing_user = User::where('str_id', $str_id)->get();
        
        if ($showing_user->isEmpty()) {
            // 削除してもどってここにきて更新すると$userはnull
            return redirect('/');
        }

        $user = Auth::user();

        // guestは削除できない仕様
        if ($user->str_id == $str_id && $str_id != 'guest') {
            if ($user->str_id == $str_id) {
                return view('user.edit', ['user' => $user]);
            } else {
                // Error 不正なアクセス
                abort('400');
            }

        // guestが編集ページにやってきた場合
        } else {
            abort('400');
        }
    }

    public function update(Request $request, $str_id)
    {
        $user = Auth::user();
        $image = $request->file('file');

        if ($user->str_id == $str_id) {
            $new_id = $request->input('str_id');
            $is_new_id = $new_id != $str_id;

            // ------ start of validation --------
            $rules = [
                'name' => 'required|max:32',
            ];
            $messages = [
                'required' => 'ユーザー名が入力されていません。',
                'name.max' => 'ユーザー名が長すぎます。32文字以内で入力してください。',
            ];

            if ($is_new_id) {
                $rules = array_merge($rules, [
                    'str_id' => 'required|max:16|unique:users',
                ]);
    
                $messages = array_merge($messages, [
                    'required'      => 'ユーザーIDが入力されていません。',
                    'str_id.max'    => 'ユーザーIDが長すぎます。16文字以内で入力してください。',
                    'str_id.unique' => '入力されたユーザーIDは既に存在しています。',
                ]);
            }

            if ($image) {
                $rules = array_merge($rules, [
                    'file' => 'mimetypes:image/jpeg,image/png',
                ]);
    
                $messages = array_merge($messages, [
                    'file.mimetypes' => '指定した拡張子のファイルが選択されていません。',
                ]);
            }

            $validator = Validator::make(request()->all(), $rules, $messages);

            if ($validator->fails()) {
                return back()
                        ->withErrors($validator)
                        ->withInput();
            }
            // -------- end of validation ----------

            // 画像が送信されていたらS3に登録、ユーザーにも代入
            if ($image) {
                $path = Storage::disk('s3')->putFile('avatar', $image, 'public');
                $user->image = Storage::disk('s3')->url($path);
            }

            $user->name = $request->input('name');
            $user->str_id = $new_id;

            $user->save();

            return redirect('/user/show/' . $new_id);
            ;
        } else {
            abort('400');
        }
    }

    public function remove(Request $request, $str_id)
    {
        $user = Auth::user();

        // guestは削除できない仕様
        if ($user->str_id == $str_id && $str_id != 'guest') {
            $user->delete();
            return redirect('/');
        } else {
            abort('400');
        }
    }

    public function follows(Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $follows = Follower::with('followUser')->get();
        $follows = $follows->where('follower_id', $user->id);

        return view('follow', [
            'type'   => 'follow',
            'people' => $follows,
        ]);
    }

    public function followers(Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $followers = Follower::with('followerUser')->get();
        $followers = $followers->where('follow_id', $user->id);

        return view('follow', [
            'type'   => 'follower',
            'people' => $followers,
        ]);
    }

    public function search(Request $request)
    {
        return view('user.search');
    }

    // public function find(Request $request)
    // {
    //     $user = $request->input('user');
    //     $users = User::where('str_id', $user)->get();

    //     // IDと名前が一致する場合を考慮してない
    //     // また、部分一致の方がいいのでは？？
    //     if ($users->isEmpty()) {
    //         $users = User::where('name', $user)->get();
    //     }
        
    //     return view('user.search', ['users' => $users]);
    // }
}
