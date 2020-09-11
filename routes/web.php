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

Route::get('/book/{isbn?}', 'BookController@index')->name('book');
Route::post('/book', 'BookController@search');

Route::get('/logout', 'Auth\LoginController@logout');
