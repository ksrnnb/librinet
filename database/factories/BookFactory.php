<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Book;
use Faker\Generator as Faker;

//  TODO: リファクタリングする。DRY原則。。。

//  GitHub実践入門
$factory->define(Book::class, function (Faker $faker) {
 
    $book = Book::fetchBook('9784774163666');
    
    return [
        'isbn' => $book->isbn,          //  GitHub実践入門
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
        'genre_id' => 1,                //  1: IT (GenreSeederで作成する)
        'isRead' => 1,                  //  読んだ
        'isWanted' => 0,                //  欲しくない（既に読んだ）
        'isRecommended' => 1,           //  おすすめしたい
    ];
});

//  リーダブルコード
$factory->state(Book::class, 'readouble', function($faker) {
    $book = Book::fetchBook('9784873115658');
    return [
        'isbn' => $book->isbn,
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
    ];
});


//  Linux
$factory->state(Book::class, 'Linux', function($faker) {
    $book = Book::fetchBook('9784797397642');
    return [
        'isbn' => $book->isbn,
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
    ];
});

//  電気羊
$factory->state(Book::class, 'Dick', function($faker) {
    $book = Book::fetchBook('9784150102296');
    return [
        'isbn' => $book->isbn,
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
        'genre_id' => 2,                //  2: SF (GenreSeederで作成する)
    ];
});

//  1984
$factory->state(Book::class, '1984', function($faker) {
    $book = Book::fetchBook('978-4151200533');
    return [
        'isbn' => $book->isbn,
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
        'genre_id' => 2,                //  2: SF (GenreSeederで作成する)
    ];
});