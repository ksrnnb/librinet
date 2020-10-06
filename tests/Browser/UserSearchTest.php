<?php

namespace Tests\Browser;

// use Illuminate\Foundation\Testing\RefreshDatabase;
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
    // use RefreshDatabase;
    use DatabaseMigrations;

    public function testUserSearchWhenNoInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
                    ->press('検索')
                    ->waitFor('.error')     // errorが表示されるまで待つ
                    ->assertSee('ユーザーが存在していません');
        });
    }

    public function testUserSearchWhenUsersDontExist()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user')
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
        $item = User::find(1)->$column;

        $browser->visit('/user')
                ->type('user', $item)
                ->press('検索')
                ->waitFor('.results')
                ->assertSee('検索結果');
    }
}
