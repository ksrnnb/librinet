<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Book;
use Faker\Generator as Faker;

$factory->define(Book::class, function (Faker $faker) {
    return [
        'isbn' => '9784774163666',  //  GitHub実践入門
        'genre_id' => 1,             //  1: IT (GenreSeederで作成する)
        'isRead' => 1,              //  読んだ
        'isWanted' => 0,            //  欲しくない（既に読んだ）
        'isRecommended' => 1,       //  おすすめしたい
    ];
});

//  はじめてのPHP
$factory->state(Book::class, 'php', [
    'isbn' => '9784873117935',
]);

//  リーダブルコード
$factory->state(Book::class, 'readouble', [
    'isbn' => '9784873115658',
]);
