<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Follower;
use App\Book;
use Illuminate\Support\Facades\Auth;

class LikeTest extends DuskTestCase
{
    /**
     * check like funciton
     */
    use DatabaseMigrations;

    protected $user1;
    protected $user2;
    protected $post;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
            
        $this->user1 = Factory(User::class)->create();
        $this->user2 = Factory(User::class)->create();

        $this->post = $this->user2->books()
                           ->save(factory(Book::class)->make())
                           ->registerPost('test-message');

        $this->credential = [
            'str_id' => $this->user1->str_id,
            'password' => config('app.guest_password')
        ];

        Follower::create([
            'follow_id' => $this->user2->id,
            'follower_id' => $this->user1->id,
        ]);
    }
    
    public function testLike()
    {
        $this->browse(function (Browser $browser) {

            $browser = $this->login($browser);

            $this->assertLike($browser);
        });
    }

    public function testLikeInCommentPage()
    {
        $this->browse(function (Browser $browser) {

            $url = '/comment/' . $this->post->uuid;

            $browser->visit($url)
                    ->waitForText('コメント');

            $this->assertLike($browser);
        });
    }

    public function assertLike(Browser $browser)
    {
        $browser->assertDataAttribute('.like-btn', 'isliked', 'false')
                ->press('.like-btn')
                ->waitFor("[data-isliked='true']")
                ->assertDataAttribute('.like-btn', 'isliked', 'true');

        $browser->refresh()
                ->waitFor('.feed')
                ->assertDataAttribute('.like-btn', 'isliked', 'true')
                ->press('.like-btn')
                ->waitFor("[data-isliked='false']")
                ->assertDataAttribute('.like-btn', 'isliked', 'false')
                ->pause(1000);
                // pauseを入れないとalertが発生する。手動だと問題ないがDuskだとNG？
                // TODO: queueを使えば問題ない？
    }
}
