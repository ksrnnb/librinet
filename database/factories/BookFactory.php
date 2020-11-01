<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Book;
use Faker\Generator as Faker;

//  GitHub実践入門
$factory->define(Book::class, function (Faker $faker) {
    return Book::getBookParams('9784774163666', 1, true);
});
