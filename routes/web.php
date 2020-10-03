<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::fallback(function () {
//     return view('welcome');
// });
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

// Auth::routes();

// Route::get('/', 'RootController@index')->name('root');
// Route::post('/', 'Auth\LoginController@guest');

// // -> /userを検索ページに
// Route::get('/user/profile/{str_id}', 'UserController@profile');

// Route::get('/user/follows/{str_id}', 'UserController@follows');
// Route::get('/user/followers/{str_id}', 'UserController@followers');

// Route::get('/user/edit/{str_id}', 'UserController@edit');
// Route::post('/user/edit/{str_id}', 'UserController@update');
// Route::post('/user/delete/{str_id}', 'UserController@remove');


// // TODO: authが必要なルートをグループにまとめる？
// // homeは認証されてなかったらゲストにリダイレクトしたい
// Route::get('/home', 'HomeController@index')->middleware('auth');

// Route::get('/book/show/{isbn}', 'BookController@show')->middleware('auth')->name('book');

// Route::get('/book/add/{isbn}', 'BookController@add');
// Route::post('/book/add/{isbn}', 'BookController@create');
// Route::get('/book/edit/{str_id}', 'BookController@edit');
// Route::post('/book/edit/{str_id}', 'BookController@update');
// Route::get('/book/delete/{str_id}', 'BookController@delete');
// Route::post('/book/delete/{str_id}', 'BookController@remove');

// Route::get('/post/{uuid}', 'PostController@index');
// Route::post('/post/{uuid}', 'PostController@comment');
// Route::post('/post/remove/{uuid}', 'PostController@remove');
// Route::get('/book/post/{isbn}', 'PostController@add');
// Route::post('/book/post/{isbn}', 'PostController@create');

// Route::post('/comment/remove/{uuid}', 'CommentController@remove');
// Route::post('/follow', 'FollowerController@follow');

// Route::get('/logout', 'Auth\LoginController@logout');

// Route::get('/{any}', function () {
//     return view('welcome');
// })->where('any', '.*');

// Route::fallback(function () {
//     return view('welcome');
// });
