<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class LoginController extends Controller
{

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        return response($status = 200);
    }

    public function login(Request $request)
    {
        
        $str_id = $request->input('strId');
        $password = $request->input('password');      //TODO:ここは暫定
        
        $credentials = compact('str_id', 'password');
        
        if (Auth::attempt($credentials)) {
            $params = User::getParamsForApp($str_id);
            
            return response()->json($params);
        } else {
            return response('Cannot Authenticated', 401);
        }
    }

    //  ゲストの認証
    public function guest(Request $request)
    {
        $str_id = 'guest';
        $password = config('app.guest_password');

        $credentials = compact('str_id', 'password');

        if (Auth::attempt($credentials)) {
            $params = User::getParamsForApp($str_id);
            
            return response()->json($params);
        } else {
            return response('Cannot Authenticated', 401);
        }
    }
}
