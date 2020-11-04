<?php

namespace Tests\Feature\Comment;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use App\Comment;

class CreateCommentTest extends TestCase
{
    use RefreshDatabase;


    protected $form = [
            'book_id' => 'nullable',
            'post_id' => 'required',
            'user_id' => 'required',
            'message' => 'required|max:100',
        ];

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

        $this->path = '/api/comment/' . $this->post->uuid;

        $this->params = [
            'book_id' => $this->post->book_id,
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'message' => 'test_message',
        ];

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotCreateIsntAuth()
    {
        $this->json('POST', $this->path, $this->params)
             ->assertStatus(401);
    }

    public function testCreateCommentWithBook()
    {
        $this->authenticate();
        
        $this->json('POST', $this->path, $this->params)
             ->assertStatus(200);

        $comment = Comment::where('user_id', $this->user->id)->first();
        $this->assertNotEquals($comment, null);
    }

    public function testCreateCommentWithoutBook()
    {
        $this->authenticate();
        $this->params['book_id'] = null;

        $this->json('POST', $this->path, $this->params)
             ->assertStatus(200);

        $comment = Comment::where('user_id', $this->user->id)->first();
        $this->assertNotEquals($comment, null);
    }

    public function testCannotCreateNoMessage()
    {
        $this->authenticate();
        $this->params['message'] = '';

        $this->json('POST', $this->path, $this->params)
             ->assertStatus(422);
    }

    public function testCannotCreateOver100Letters()
    {
        $this->authenticate();
        $this->params['message'] = str_repeat('a', 100);

        // 100文字まではOK
        $this->json('POST', $this->path, $this->params)
             ->assertStatus(200);

        // 100文字以上はNG
        $this->params['message'] = str_repeat('a', 101);
        $this->json('POST', $this->path, $this->params)
             ->assertStatus(422);
    }
}
