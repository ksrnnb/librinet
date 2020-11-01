<?php

namespace Tests\Feature\Post;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use App\Post;

class DeletePostTest extends TestCase
{
    use RefreshDatabase;
    
    protected $credential;
    protected $user;
    protected $uuid;
    protected $params;
    protected $path;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
        $book_array = Book::getBookParams('9784774163666');
        $this->post = $this->user
                     ->books()
                     ->create($book_array)
                     ->registerPost('test_message');

        $this->path = '/api/post';
        $this->params = ['uuid' => $this->post->uuid];

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotDeleteWhenIsNotAuthenticated()
    {
        $this->json('DELETE', $this->path, $this->params)
             ->assertStatus(401);
    }

    public function testCannotDeleteWhenUuidIsWrong()
    {
        $this->authenticate();

        $params = ['uuid' => $this->post->uuid . 'hoge'];
        $this->json('DELETE', $this->path, $params)
             ->assertStatus(400);
    }

    public function testCanDelete()
    {
        $this->authenticate();
        
        $this->json('DELETE', $this->path, $this->params)
             ->assertStatus(200);

        // 削除後に残ってないことを確認
        $post = Post::find($this->post->id);
        $this->assertEquals($post, null);
    }
}
