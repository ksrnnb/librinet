<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class UserTest extends DuskTestCase
{
    /**
     * user search funciton
     *
     *
     */
    use RefreshDatabase;
    use DatabaseMigrations;

    protected $user;
    protected $hasCreated = false;

    protected function setUp(): void
    {
        parent::setUp();
        if (!$this->hasCreated) {
            $this->user = Factory(User::class)->create();
            $this->hasCreated = true;
        }
    }

    public function testUserSearchWhenNoInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
                    ->waitFor('#user')
                    ->press('検索')
                    ->waitFor('.error')     // errorが表示されるまで待つ
                    ->assertSee('ユーザーが存在していません');
        });
    }

    public function testUserSearchWhenUsersDontExist()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
                    ->waitFor('#user')
                    ->type('user', 'HOGEHOGE')
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
                ->assertSee('検索結果');
    }
}
