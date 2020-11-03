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


Route::post('/login', 'Api\LoginController@login');
Route::post('/signup', 'Auth\RegisterController@register');
Route::post('/guest/login', 'Api\LoginController@guest');
Route::post('/book', 'Api\BookController@search');
Route::post('/user', 'Api\UserController@search');
Route::get('/user/auth', 'Api\UserController@auth');
Route::get('/user/profile/{str_id}', 'Api\UserController@show');
Route::get('/followers/{str_id}/{target}', 'Api\FollowerController@followers');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', 'Api\LoginController@logout');

    Route::post('/like', 'Api\LikeController@like');

    Route::post('/user/edit', 'Api\UserController@edit');
    Route::delete('/user', 'Api\UserController@delete');


    Route::post('/book/add', 'Api\BookController@create');
    Route::delete('/book', 'Api\BookController@delete');
    
    Route::get('/post/id/{id}', 'Api\PostController@get');
    Route::post('/book/post/{isbn}', 'Api\PostController@create');
    Route::delete('/post', 'Api\PostController@delete');
    
    Route::post('/genre/edit', 'Api\GenreController@edit');
    
    Route::post('/notification', 'Api\NotificationController@update');
    
    Route::get('/comment/id/{id}', 'Api\CommentController@get');
    Route::get('/comment/{uuid}', 'Api\CommentController@add');
    Route::post('/comment/{uuid}', 'Api\CommentController@create');
    Route::delete('/comment', 'Api\CommentController@delete');
    
    Route::post('/follow', 'Api\FollowerController@follow');
});

// Route::middleware('auth:sanctum')->get('guest/login', 'Auth\LoginController@guest');

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
