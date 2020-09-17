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

    public function testUserSearchWhenUserMatchesByIdAndCanAccessUserPage()
    {
        $this->browse(function (Browser $browser) {
            $this->assertUsersExistAndCanAccessUserPage($browser, 'str_id');
        });
    }

    public function testUserSearchWhenUsersMatchByNameAndCanAccessUserPage()
    {
        $this->browse(function (Browser $browser) {
            $this->assertUsersExistAndCanAccessUserPage($browser, 'name');
        });
    }

    public function assertUsersExistAndCanAccessUserPage($browser, $column)
    {
        $item = User::find(1)->$column;

            $browser->visit('/user/search')
                    ->type('user', $item)
                    ->press('検索');
            
            // 一番上のユーザーを選択
            $str_id = $browser->attribute('.user-link', 'data-id');

            $browser->click('.user-link')
                    ->assertPathIs('/user/' . $str_id);     // ユーザーページへ遷移
    }
}
