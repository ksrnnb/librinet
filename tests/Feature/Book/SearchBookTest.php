<?php

namespace Tests\Feature\Book;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SearchBookTest extends TestCase
{
    public $path = '/api/book';

    public function testCannotSearchBecauseArgumentIsntIsbn()
    {
        // validation error -> unprocessable 422
        $this->json('POST', $this->path, ['isbn' => ''])
             ->assertStatus(422);

        $this->json('POST', $this->path, ['isbn' => 'hoge'])
             ->assertStatus(422);

        // 14桁
        $this->json('POST', $this->path, ['isbn' => '97847741636660'])
             ->assertStatus(422);

        // 12桁
        $this->json('POST', $this->path, ['isbn' => '978477416366'])
             ->assertStatus(422);
    }

    public function testCanSearch()
    {
        // 13桁
        $this->json('POST', $this->path, ['isbn' => '9784774163666'])
             ->assertStatus(200)
             ->assertJsonStructure([
                'isbn',
                'title',
                'author',
                'cover',
                'publisher',
                'pubdate',
             ]);
    }
}
