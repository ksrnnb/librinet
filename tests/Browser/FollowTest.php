<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Follower;

class FollowTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user1;
    protected $user2;
    protected $credential;
    protected $path;

    protected function setUp(): void
    {
        parent::setUp();
            
        $this->user1 = Factory(User::class)->create();
        $this->user2 = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user1->str_id,
            'password' => config('app.guest_password')
        ];

        $this->my_path = '/user/profile/' . $this->user1->str_id;
        $this->target_path = '/user/profile/' . $this->user2->str_id;
    }

    public function testFollowAndCheckFollowNumber()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            // フォローした後、フォロワーが1人増えるのを確認
            $browser->visit($this->target_path)
                    ->waitFor('.user-card')
                    ->assertSee('フォローする')
                    ->press('フォローする')
                    ->waitForText('Follower: 1')
                    ->assertDataAttribute('#follow', 'count', '0')
                    ->assertDataAttribute('#follower', 'count', '1');

            // 自分のページに戻って、フォローが1人増えるのを確認
            $browser->visit($this->my_path)
                    ->waitFor('.user-card')
                    ->assertDataAttribute('#follow', 'count', '1')
                    ->assertDataAttribute('#follower', 'count', '0');
                    
            // フォローを外して、フォロワーが減るのを確認
            $browser->visit($this->target_path)
                    ->waitFor('.user-card')
                    ->assertSee('フォロー中')
                    ->press('フォロー中')
                    ->waitForText('Follower: 0')
                    ->assertDataAttribute('#follow', 'count', '0')
                    ->assertDataAttribute('#follower', 'count', '0');

            // 自分のページに戻って、フォローが1人減るのを確認
            $browser->visit($this->my_path)
                    ->waitFor('.user-card')
                    ->assertDataAttribute('#follow', 'count', '0')
                    ->assertDataAttribute('#follower', 'count', '0');
        });
    }
}
