<?php

namespace Tests\Feature\Like;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use App\Notification;

class LikeTest extends TestCase
{
    use RefreshDatabase;

    protected $path;
    protected $params;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
        $target_user = factory(User::class)->create();
        $book_array = Book::getBookParams('9784774163666');

        $post = $target_user->books()
                            ->create($book_array)
                            ->registerPost('test_message');
        
        $this->path = '/api/like';
        $this->params = ['uuid' => $post->uuid];
        
        $login_user = factory(User::class)->create();
        $this->credential = [
            'strId' => $login_user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotLikeWithoutLogin()
    {
        $this->json("POST", $this->path, $this->params)
             ->assertStatus(401);
    }

    public function testLikeAndNotificationDoesntCreateManyTimes()
    {
        $this->authenticate();

        // 初めは通知なし
        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);

        // いいね後の通知を取得
        $notification = Notification::all()->last();

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);

        // いいねを取り消すと通知も消える。
        $this->assertEquals(Notification::find($notification->id), null);
    }
}
