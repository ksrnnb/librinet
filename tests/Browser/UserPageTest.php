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
                    ->assertMissing('.dropdown-toggle');
        });
    }

    public function testCannotSeeEditButtonBecauseDontHaveBook()
    {
        $this->browse(function (Browser $browser) {

            $browser = $this->login($browser);

            // 本がないので、ボタンは表示されない
            $browser->visit($this->path)
                    ->waitFor('.user-card')
                    ->assertMissing('.dropdown-toggle');
        });
    }

    public function testCanSeeDeleteBook()
    {
        $this->browse(function (Browser $browser) {

            // 本とジャンルを追加してからユーザーページに移動する。
            $this->user->books()
                       ->save(factory(Book::class)->make());
            Genre::create(
                ['name' => 'TEST_GENRE']
            );

            $browser->visit($this->path)
                    ->waitFor('.user-card')
                    ->press('.dropdown-toggle')
                    ->assertSee('本を削除する');
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
                    ->press('ログイン')
                    ->waitForLocation('/home')
                    ->waitFor('#subtitle');

            // ゲストの場合は名前とIDが編集できない
            $browser->visit('/user/edit/guest')
                    ->waitFor('#user-name')
                    ->assertSee('編集できません')
                    ->assertSee('削除できません')
                    ->assertAttribute('#user-name', 'disabled', 'true')
                    ->assertAttribute('#user-id', 'disabled', 'true');
        });
    }
}
