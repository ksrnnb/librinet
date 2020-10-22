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
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
            
        $this->user1 = Factory(User::class)->create();
        $this->user2 = Factory(User::class)->create();

        $this->user2->books()
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

            $browser->waitFor('.feed')
                    ->assertDataAttribute('#like-icon', 'isliked', 'false')
                    ->press('#like-icon')
                    ->assertDataAttribute('#like-icon', 'isliked', 'true');

            $browser->refresh()
                    ->waitFor('.feed')
                    ->assertDataAttribute('#like-icon', 'isliked', 'true')
                    ->press('#like-icon')
                    ->assertDataAttribute('#like-icon', 'isliked', 'false');
        });
    }
}
