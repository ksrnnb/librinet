<?php

namespace Tests\Feature\Book;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use App\Genre;

class CreateBookTest extends TestCase
{
    use RefreshDatabase;

    protected $path = '/api/book/add';

    protected $form = [
            'user_id'           => 1,
            'isInBookshelf'     => true,
            'isbn'              => '9784774163666',
            'title'             => 'test_title',
            'author'            => 'test_author',
            'publisher'         => 'test_publisher',
            'pubdate'           => 'test_pubdate',
            'cover'             => 'test_cover',
            'is_new_genre'      => true,
            'new_genre'         => 'test_genre_name',
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

    public function testCannotCreateValidation()
    {
        $this->authenticate();

        // null
        $wrong_form = array_merge($this->form, [
            'new_genre' => '',
        ]);

        $this->json('POST', $this->path, $wrong_form)
             ->assertStatus(422);

        // too long
        $wrong_form = array_merge($this->form, [
                'new_genre' => str_repeat('a', 17),
            ]);

        $this->json('POST', $this->path, $wrong_form)
             ->assertStatus(422);
    }
}
