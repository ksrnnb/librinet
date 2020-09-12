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

Route::get('/user/{str_id}', 'UserController@index');

Route::get('/home', 'HomeController@index')->middleware('auth');

Route::get('/book', 'BookController@index');
Route::post('/book', 'BookController@search');
Route::get('/book/{isbn}', 'BookController@show')->name('book');
Route::post('/book/{isbn}', 'BookController@post');

Route::get('/book/post/{isbn}', 'PostController@show')->name('post');
Route::post('/book/post/{isbn}', 'PostController@post');

Route::get('/logout', 'Auth\LoginController@logout');
