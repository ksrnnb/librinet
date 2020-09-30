<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{

    public function logout(Request $request)
    {
        // return response(['hoge' => 'logout']);
        // わからん、ガードあたりがあやしい
        Auth::guard('api')->logout();
        return redirect('/');
    }

    public function login(Request $request)
    {
        $str_id = $request->input('strId');
        $password = env('GUEST_PASSWORD');      //TODO:ここは暫定

        $credentials = [
            'str_id' => $str_id,
            'password' => $password,
        ];

        if (Auth::attempt($credentials)) {
            // return redirect('/home');
            return response()->json(['login' => true]);
        } else {
            return response()->json(['foo' => 'foo']);

            // return redirect('/');
        }
    }

    //  ゲストの認証
    public function guest(Request $request)
    {
        $credentials = [
            'str_id' => 'guest',
            'password' => env('GUEST_PASSWORD'),
        ];

        if (Auth::attempt($credentials)) {
            // return redirect('/home');
            return true;
        } else {
            return response()->json(['foo' => 'foo']);

            // return redirect('/');
        }
    }
}
