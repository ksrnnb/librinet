<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class EditUserTest extends DuskTestCase
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

    public function testAccessEditPageWhenIsNotAuthenticated()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitForLocation('/')
                    ->assertSee('ゲストユーザーでログイン');
        });
    }

    public function testEditUser()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $new_name = 'test_new_user';
            $new_str_id = 'test_new_id';

            $browser->visit($this->path)
                    ->waitFor('.my-card')
                    ->type('#user-name', $new_name)
                    ->press('編集する')
                    ->waitForText('本棚')
                    ->assertSee($new_name);

            $browser->visit($this->path)
                    ->waitFor('.my-card')
                    ->type('#user-id', $new_str_id)
                    ->press('編集する')
                    ->waitForText('本棚')
                    ->assertSee($new_str_id);
        });
    }

    public function testCannotEditOtherUser()
    {
        $this->browse(function (Browser $browser) {
            $other_user = Factory(User::class)->create();
            $edit_path = '/user/edit/' . $other_user->str_id;
            $profile_path = '/user/profile/' . $other_user->str_id;

            $browser->visit($edit_path)
                    ->waitForLocation($profile_path)
                    ->waitFor('.my-card')
                    ->assertSee('本棚');
        });
    }
}
