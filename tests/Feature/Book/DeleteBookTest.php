<?php

namespace Tests\Feature\Book;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Arr;
use App\Book;
use App\User;

class DeleteBookTest extends TestCase
{
    use RefreshDatabase;

    protected $path = '/api/book';

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
        $book_array = Book::getBookParams('9784774163666');
        $this->user->books()->create($book_array);

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotDeleteWhenIsntAuthenticated()
    {
        $book_id = $this->user->books[0]->id;
        $params = [
            'ids' => Arr::wrap($book_id),
        ];

        $this->json('DELETE', $this->path, $params)
             ->assertStatus(401);
    }

    public function testCanDeleteWhenIsAuthenticated()
    {
        $this->authenticate();
        $book_id = $this->user->books[0]->id;
        
        $params = [
            'ids' => Arr::wrap($book_id),
        ];

        $response = $this->json('DELETE', $this->path, $params);
        $response->assertStatus(200);

        $book = Book::find($book_id);
        $this->assertEquals($book, null);
    }
}
