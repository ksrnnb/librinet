<?php

namespace Tests\Feature\Post;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class CreatePostTest extends TestCase
{
    use RefreshDatabase;

    protected $isbn = '9784774163666';
    protected $path;
    protected $user;
    protected $credential;

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
        'message'           => 'test_message',
    ];
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->path = '/api/book/post/' . $this->isbn;
        $this->user = factory(User::class)->create();

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotCreateWhenIsntAuthenticated()
    {
        $this->json('POST', $this->path, $this->form)
             ->assertStatus(401);
    }

    public function testCannotCreateValidationError()
    {
        $this->authenticate();
        $this->form['new_genre'] = '';

        $this->json('POST', $this->path, $this->form)
             ->assertStatus(422);

        $this->form['new_genre'] = 'test_genre';
        $this->form['message'] = str_repeat('a', 101);
        $this->json('POST', $this->path, $this->form)
             ->assertStatus(422);
    }

    public function testCanCreate()
    {
        $this->authenticate();

        $this->json('POST', $this->path, $this->form)
             ->assertStatus(200);
    }
}
