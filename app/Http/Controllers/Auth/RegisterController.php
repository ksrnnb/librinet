<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */
    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $rules = [
            'str_id'    => [
                'required',
                'string',
                'regex:/^\w{4,16}$/',
                'unique:users',
            ],
            'name'      => [
                'required',
                'string',
                // PHPは\u3000が使えないので注意。Unicode propertyを参照。
                'regex:/.{1,16}$/',
            ],
            'email'     => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
            ],
            'password'  => [
                'required',
                'string',
                'regex:/^[\w\|\^\$\*\+\?\.\(\)\[\]\/\\!@#$%&-_+={}:;"\'?>.,<`~]{6,255}$/',
                'confirmed',
            ],
            'password_confirmation' => [
                'required',
                'string',
                'regex:/^[\w\|\^\$\*\+\?\.\(\)\[\]\/\\!@#$%&-_+={}:;"\'?>.,<`~]{6,255}$/',
            ],
        ];

        $messages = [
            'str_id.unique' => 'ユーザーIDが既に存在しています。',
        ];
        
        return Validator::make($data, $rules, $messages);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'str_id' => $data['str_id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

     // vendor/laravel/ui/auth-backend/RegistersUsers.phpからオーバーライド
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        $this->guard()->login($user);

        // if ($response = $this->registered($request, $user)) {
        //     return $response;
        // }
        $params = User::getParamsForApp($user->str_id);

        return response()->json($params);
    }
}
