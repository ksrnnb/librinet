<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Book;
use App\Genre;

class BookTest extends TestCase
{
    public $isbn = '9784774163666';
    public $genre_id = 1;
    public $is_in_bookshelf = true;
    public $keys = [
        'isbn',
        'title',
        'author',
        'cover',
        'publisher',
        'pubdate',
        'genre_id',
        'isInBookshelf',
    ];

    public function testGetBookParamsWithoutArguments()
    {
        $book = Book::getBookParams($this->isbn);

        foreach ($this->keys as $key) {
            $this->assertArrayHasKey($key, $book);
        }

        $this->assertEquals($book['genre_id'], null);
        $this->assertEquals($book['isInBookshelf'], false);
    }

    public function testGetBookParamsWithArguments()
    {
        $book = Book::getBookParams($this->isbn, $this->genre_id, $this->is_in_bookshelf);

        foreach ($this->keys as $key) {
            $this->assertArrayHasKey($key, $book);
        }

        $this->assertEquals($book['genre_id'], $this->genre_id);
        $this->assertEquals($book['isInBookshelf'], $this->is_in_bookshelf);
    }
}
