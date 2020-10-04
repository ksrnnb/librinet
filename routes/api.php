<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::post('/guest/login', function () {
//     return response()->json(['hoge' => 'hoge']);
// });
Route::post('/login', 'Api\LoginController@login');
Route::post('/guest/login', 'Api\LoginController@guest');
Route::post('/book', 'Api\BookController@search');
Route::post('/user', 'Api\UserController@search');
Route::get('/user/auth', 'Api\UserController@auth');
Route::get('/user/profile/{str_id}', 'Api\UserController@show');
// Route::post('/user/profile/{str_id}', 'Api\UserController@search');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', 'Api\LoginController@logout');
    Route::post('/like', 'Api\LikeController@like');
    Route::get('/book/post/{isbn}', 'Api\PostController@add');
    Route::post('/book/post/{isbn}', 'Api\PostController@create');
    Route::get('/comment/{uuid}', 'Api\CommentController@add');
    Route::post('/comment/{uuid}', 'Api\CommentController@create');
});

// Route::middleware('auth:sanctum')->get('guest/login', 'Auth\LoginController@guest');

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
