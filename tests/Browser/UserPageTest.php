<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;
use App\Genre;

class UserPageTest extends DuskTestCase
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
        $this->path = '/user/profile/' . $this->user->str_id;
    }

    public function testCannotSeeEditButtonWithoutLogin()
    {
        $this->browse(function (Browser $browser) {

            $browser->visit($this->path)
                    ->waitFor('.user-card')
                    ->assertSee($this->user->name)
                    ->assertDontSee('編集する')
                    ->assertDontSee('削除する');
        });
    }

    public function testCanSeeEditButton()
    {
        $this->browse(function (Browser $browser) {

            $browser = $this->login($browser);

            // 本がないので、本を削除するボタンは表示されない
            $browser->visit($this->path)
                    ->waitFor('.user-card')
                    ->assertSee('編集する')
                    ->assertDontSee('削除する');
        });
    }

    public function testCanSeeDeleteButton()
    {
        $this->browse(function (Browser $browser) {

            // 本とジャンルを追加してからユーザーページに移動する。
            $this->user->books()
                       ->save(factory(Book::class)->make());
            factory(Genre::class)->create(
                ['name' => 'TEST_GENRE']
            );

            $browser->visit($this->path)
                    ->waitFor('.user-card')
                    ->assertSee('削除する');
        });
    }

    public function testCannotEditGuestUser()
    {
        $this->browse(function (Browser $browser) {

            $guest = Factory(User::class)->create(
                ['str_id' => 'guest']
            );

            // ゲストでログイン
            $browser->visit('/login')
                    ->waitFor('#user-id')
                    ->type('user-id', $guest->str_id)
                    ->type('password', $this->credential['password'])
                    ->press('Login')
                    ->waitForText('Home');

            // ゲストの場合は編集ボタンが無効
            $browser->visit('/user/profile/guest')
                    ->waitFor('.user-card')
                    ->assertSee('編集できません')
                    ->assertAttribute('.btn-outline-success', 'disabled', 'true');
        });
    }
}
