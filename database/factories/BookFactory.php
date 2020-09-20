<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Book;
use Faker\Generator as Faker;

function getBookParams($isbn, $genre_id = 1)
{

    $book = Book::fetchBook($isbn);

    $params = [
        'isbn' => $isbn,          
        'title' => $book->title,
        'author' => $book->author,
        'cover' => $book->cover,
        'publisher' => $book->publisher,
        'pubdate' => $book->pubdate,
        'genre_id' => $genre_id,        //  1: IT (GenreSeederで作成する)
        'isInBookshelf' => true,        //  1: 自分の本棚
    ];

    return $params;
}

//  GitHub実践入門
$factory->define(Book::class, function (Faker $faker) {
    return getBookParams('9784774163666');
});

$books = [
    'readouble' => ['isbn' => '9784873115658', 'genre_id' => 1],
    'Linux'     => ['isbn' => '9784797397642', 'genre_id' => 1],
    'Dick'      => ['isbn' => '9784150102296', 'genre_id' => 2],
    '1984'      => ['isbn' => '9784151200533', 'genre_id' => 2],
];

foreach ($books as $name => $book) {
    $factory->state(Book::class, $name, function($faker) use ($book) {
        return getBookParams($book['isbn'], $book['genre_id']);
    });
}