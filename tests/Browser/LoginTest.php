<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class LoginTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testNormalUserLogin()
    {
        $this->browse(function (Browser $browser) {

            $browser = $this->login($browser);

            $browser->assertSee('ログアウト');
        });
    }

    public function testGuestUserLogin()
    {
        $this->browse(function (Browser $browser) {

            Factory(User::class)->create(['str_id' => 'guest']);

            $browser->visit('/login')
                    ->waitFor('#user-id')
                    ->press('ゲスト')
                    ->waitForLocation('/home')
                    ->waitFor('#subtitle')
                    ->assertSee('ログアウト');
        });
    }
}
