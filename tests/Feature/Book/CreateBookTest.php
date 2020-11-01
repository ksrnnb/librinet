<?php

namespace Tests\Feature\Book;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;

class CreateBookTest extends TestCase
{
    use RefreshDatabase;

    protected $path = '/api/book/add';

    protected $form = [
            'add_to_bookshelf'  => true,
            'is_new_genre'      => true,
            'new_genre'         => 'test_genre_name',
            'title'             => 'test_title',
            'author'            => 'test_author',
            'cover'             => 'test_cover',
            'publisher'         => 'test_publisher',
            'pubdate'           => 'test_pubdate',
            'isbn'              => '9784774163666',
            'user_id'           => 1,
            'genre_id'          => 1,
        ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }
    
    public function testCannotCreateWhenIsntAuthenticated()
    {
        // Unauthorized jsonでpostすると302にならずに401で返ってくる
        $this->json('Post', $this->path, $this->form)
             ->assertStatus(401);
    }

    public function testCanCreateWhenIsAuthenticated()
    {
        $this->authenticate();
        $this->json('POST', $this->path, $this->form)
             ->assertStatus(200);

        $book = Book::find(1);
        $this->assertEquals($book->title, 'test_title');
    }
}
