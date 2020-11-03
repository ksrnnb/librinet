<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class DeleteUserTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $path;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->path = '/user/edit/' . $this->user->str_id;
    }

    public function testDeleteUser()
    {
        $this->browse(function (Browser $browser) {

            $browser = $this->login($browser);

            $browser->visit($this->path)
                    ->waitForText('アカウントを削除する')
                    ->press('アカウントを削除する')
                    ->waitForText('はい')
                    ->press('はい')
                    ->waitForLocation('/')
                    ->assertSee('ユーザー登録');

            $user = User::find($this->user->id);
            $this->assertEquals($user, null);
        });
    }
}
