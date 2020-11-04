<?php

namespace Tests\Feature\Post;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Book;
use App\User;
use App\Post;

class GetPostTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $post;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
        $book_array = Book::getBookParams('9784774163666');
        $post = $this->user
                     ->books()
                     ->create($book_array)
                     ->registerPost('test_message');

        $this->path = '/api/post/id/' . $post->id;

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotGetWhenIsNotAuthenticated()
    {
        $this->json('GET', $this->path)
             ->assertStatus(401);
    }

    public function testCannotGetWhenIdIsWrong()
    {
        $this->authenticate();

        $this->json('GET', $this->path . '10')
             ->assertStatus(404);

        $this->json('GET', $this->path . 'alphabet294')
             ->assertStatus(400);
    }

    public function testCanGet()
    {
        $this->authenticate();

        // postの情報と、関連づくuser, book ,likes, commentsの情報。
        $this->json('GET', $this->path)
             ->assertStatus(200)
             ->assertJsonStructure([
                 'id',
                 'uuid',
                 'user_id',
                 'book_id',
                 'message',
                 'user',
                 'book',
                 'likes',
                 'comments',
             ]);
    }
}
