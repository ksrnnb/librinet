<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserRequest;
use App\User;
use App\Book;
use App\Follower;
use Validator;

class UserController extends Controller
{
    public function index(Request $request, $str_id)
    {
        $user = User::where('str_id', $str_id)->get();
    
        if ($user->isEmpty()) {
            // 削除してもどってここにきて更新すると$userはnull
            return redirect('/');
        }

        $user_book_data = User::getArrayForUserPageView($str_id);

        $viewer_id = Auth::id();
        $user = $user_book_data['user'];
        $follow_data = Follower::getFollowDataForUserPageView($user, $viewer_id);
        
        $params = array_merge($user_book_data, $follow_data);

        return view('user.index', $params);
        
    }

    public function edit (Request $request, $str_id)
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
                // TODO: Error 不正なアクセス
                // 編集して戻るボタン押した時もここになる
                return redirect('/');
    
            }

        // guestが編集ページにやってきた場合
        } else {
            return redirect('/');
        }

    }

    public function update (Request $request, $str_id)
    {
        $user = Auth::user();

        if ($user->str_id == $str_id) {

            $new_id = $request->input('str_id');
            $is_new_id = $new_id != $str_id;

            // start of validation
            $rules = [
                'name' => 'required|max:32',
            ];
            $messages = [
                'required' => 'ユーザー名が入力されていません',
                'name.max' => 'ユーザー名が長すぎます。32文字以内で入力してください。',
            ];

            if ($is_new_id) {

                $rules = array_merge($rules, [
                    'str_id' => 'required|max:16|unique:users',
                ]);
    
                $messages = array_merge($messages, [
                    'required'      => 'ユーザーIDが入力されていません',
                    'str_id.max'    => 'ユーザーIDが長すぎます。16文字以内で入力してください。',
                    'str_id.unique' => '入力されたユーザーIDは既に存在しています。',
                ]);

            }

            $validator = Validator::make(request()->all(), $rules, $messages);

            if ($validator->fails()) {
                return back()
                        ->withErrors($validator)
                        ->withInput();
            }
            // end of validation

            $user->name = $request->input('name');
            $user->str_id = $new_id;

            $user->save();

            return redirect('/user/show/' . $new_id);;

        } else {
            // TODO: Error 不正なアクセス

        }
    }

    public function remove (Request $request, $str_id)
    {
        $user = Auth::user();

        // guestは削除できない仕様
        if ($user->str_id == $str_id && $str_id != 'guest') {

            $user->delete();
            return redirect('/');

        } else {
            // TODO: Error 不正なアクセス
            return back();
        }
    }

    public function action (Request $request)
    {
        $form = $request->except('_token');

        $action       = $form['action'];
        $follow_id    = $form['follow_id'];
        $follower_id  = $form['follower_id'];

        if ($action == 'follow') {
            Follower::create([
                'follow_id' => $follow_id,
                'follower_id' => $follower_id,
            ]);
        } elseif ($action == 'unfollow') {
            Follower::where('follower_id', $follower_id)
                    ->where('follow_id', $follow_id)
                    ->first()
                    ->delete();
        } else {
            // error
        }

        return back();
    }

    public function follows (Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $follows = Follower::with('follow_user')->get();
        $follows = $follows->where('follower_id', $user->id);

        return view ('follow', [
            'type'   => 'follow',
            'people' => $follows,
        ]);
    }

    public function followers (Request $request, $id)
    {
        $user = User::where('str_id', $id)->first();

        $followers = Follower::with('follower_user')->get();
        $followers = $followers->where('follow_id', $user->id);

        return view ('follow', [
            'type'   => 'follower',
            'people' => $followers,
        ]);

    }

    public function search (Request $request)
    {
        return view('user.search');
    }

    public function find (Request $request)
    {
        $user = $request->input('user');
        $users = User::where('str_id', $user)->get();

        // IDと名前が一致する場合を考慮してない
        // また、部分一致の方がいいのでは？？
        if ($users->isEmpty()) {
            $users = User::where('name', $user)->get();
        }
        
        return view('user.search', ['users' => $users]);
    }
    
}
