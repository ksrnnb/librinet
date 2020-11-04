<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;
use App\Follower;

class NotificationTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->post = $this->user->books()
                                 ->save(factory(Book::class)->make())
                                 ->registerPost('test_message');
    }

    public function createNotifications($user)
    {
        // コメントの作成
        $this->post->createComment($user_id = $user->id, $message = 'test_message');

        // いいねの作成
        $like = $this->post->likes()->create([
            'user_id' => $user->id,
        ]);

        // フォロー
        $follower = Follower::create([
            'follow_id' => $this->user->id,
            'follower_id' => $user->id,
        ]);
    }

    public function testCannotAccessWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/notification')
                    ->waitForLocation('/')
                    ->assertSee('シェア');
        });
    }

    public function testCanAccessWithNoNotifications()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $browser->visit('/notification')
                    ->waitForText('通知')
                    ->assertDontSee('Home');
        });
    }

    public function testCannotSeeNotificationsByMyselfAction()
    {
        $this->browse(function (Browser $browser) {
            $this->createNotifications($this->user);

            $browser->visit('/notification')
                    ->waitForText('通知')
                    ->assertDontSee('フォローしました')
                    ->assertDontSee('コメントしました')
                    ->assertDontSee('いいねしました');
        });
    }

    public function testCanSeeNotifications()
    {
        $this->browse(function (Browser $browser) {
            $other_user = Factory(User::class)->create();
            $this->createNotifications($other_user);

            $browser->visit('/home')
                    ->waitFor('.feed')
                    ->pause(1000);

            $browser->visit('/notification')
                    ->waitForText('通知')
                    ->assertSee('フォローしました')
                    ->assertSee('コメントしました')
                    ->assertSee('いいねしました');
        });
    }
}
