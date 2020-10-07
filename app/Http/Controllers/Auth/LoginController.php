<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }


    //  メールではなくてstr_idでログインする
    public function username()
    {
        return 'str_id';
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/');
    }

    //  ゲストの認証
    public function guest(Request $request)
    {
        $credentials = [
            'str_id' => 'guest',
            'password' => config('app.guest_password'),
        ];

        if (Auth::attempt($credentials)) {
            // return redirect('/home');
            return response()->json(['hoge' => 'hoge']);
        } else {
            return response()->json(['foo' => 'foo']);

            // return redirect('/');
        }
    }
}
