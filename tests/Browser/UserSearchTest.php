<?php

namespace Tests\Browser;

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

    public function testUserSearchWhenNoInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->click('#guest')                   // ゲストでログイン
                    ->clickLink('ユーザーを検索する')
                    ->assertSee('例')
                    ->press('検索')
                    ->assertSee('例');
        });
    }

    public function testUserSearchWhenUsersDontExist()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/user/search')
                    ->type('user', 'HOGEHOGE')
                    ->press('検索')
                    ->assertSee('ユーザーが見つかりません');
        });
    }

    public function testUserSearchWhenUserMatchesById()
    {
        $this->browse(function (Browser $browser) {
            $id = User::find(1)->str_id;

            $browser->visit('/user/search')
                    ->type('user', $id)
                    ->press('検索')
                    ->assertSee('@' . $id);
        });
    }

    public function testUserSearchWhenUsersMatchByName()
    {
        $this->browse(function (Browser $browser) {
            $name = User::find(1)->name;

            $browser->visit('/user/search')
                    ->type('user', $name)
                    ->press('検索')
                    ->assertSee($name);
        });
    }
}
