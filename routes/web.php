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

Auth::routes();

Route::get('/', 'RootController@index')->name('root');
Route::post('/', 'Auth\LoginController@guest');

Route::get('/user/search', 'UserController@search');
Route::post('/user/search', 'UserController@find');
Route::get('/user/{str_id}', 'UserController@index');
Route::post('/user/{str_id}', 'UserController@action');
Route::get('/user/{str_id}/follows', 'UserController@follows');
Route::get('/user/{str_id}/followers', 'UserController@followers');


// TODO: あとで下の通りにURLを変更したい。現状、searchというuser_idで登録したら、アクセスできなくなる
// 　　　　テスト機能追加後の方がやりやすいと思う。

// Route::get('/user/show/{str_id}', 'UserController@index');
// Route::post('/user/show/{str_id}', 'UserController@action');
// Route::get('/user/follows/{str_id}', 'UserController@follows');
// Route::get('/user/followers/{str_id}', 'UserController@followers');

Route::get('/home', 'HomeController@index')->middleware('auth');

Route::get('/book', 'BookController@index');
Route::post('/book', 'BookController@search');
Route::get('/book/{isbn}', 'BookController@show')->name('book');
Route::get('/book/add/{isbn}', 'BookController@add');
Route::post('/book/add/{isbn}', 'BookController@create');
Route::get('/user/{str_id}/book/edit', 'BookController@edit');
Route::post('/user/{str_id}/book/edit', 'BookController@update');
Route::get('/user/{str_id}/book/delete', 'BookController@delete');
Route::post('/user/{str_id}/book/delete', 'BookController@remove');

Route::get('/post/{uuid}', 'PostController@index');
Route::post('/post/{uuid}', 'PostController@comment');
Route::get('/book/post/{isbn}', 'PostController@add');
Route::post('/book/post/{isbn}', 'PostController@create');

Route::post('/like/{uuid}', 'LikeController@like');

Route::get('/logout', 'Auth\LoginController@logout');
