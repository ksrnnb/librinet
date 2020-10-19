<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class SearchUserTest extends DuskTestCase
{
    /**
     * user search funciton
     *
     *
     */
    use DatabaseMigrations;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = Factory(User::class)->create();
    }

    public function testUserSearchWhenNoInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
                    ->waitFor('#user')
                    ->press('検索')
                    ->waitFor('.error')     // errorが表示されるまで待つ
                    ->assertSee('入力されていません');
        });
    }

    public function testUserSearchWhenUsersDontExist()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
                    ->waitFor('#user')
                    ->type('user', 'test_wrong_input')
                    ->press('検索')
                    ->waitFor('.error')
                    ->assertSee('ユーザーが存在していません');
        });
    }

    public function testUserSearchWhenUserMatchesById()
    {
        $this->browse(function (Browser $browser) {
            $this->assertUsersExist($browser, 'str_id');
        });
    }

    public function testUserSearchWhenUserMatchesByName()
    {
        $this->browse(function (Browser $browser) {
            $this->assertUsersExist($browser, 'name');
        });
    }

    public function assertUsersExist($browser, $column)
    {
        $item = $this->user->$column;

        $browser->visit('/user')
                ->waitFor('#user')
                ->type('user', $item)
                ->press('検索')
                ->waitFor('.results')
                ->assertSee('検索結果')
                ->click('.user-card')
                ->assertSee('本棚');
    }
}
