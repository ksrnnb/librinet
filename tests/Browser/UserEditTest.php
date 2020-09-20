<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class UserEditTest extends DuskTestCase
{

    public static $user;
    public static $user_url;
    public static $edit_url;

    public function testEditUserName()
    {
        // user_id = 5のテストユーザー
        self::$user = \App\User::with('books')->get()->where('id', 5)->first();
        self::$user_url = '/user/' . self::$user->str_id;
        self::$edit_url = '/user/edit/' . self::$user->str_id;

        $this->browse(function (Browser $browser) {
            $browser->loginAs(self::$user)
                    ->visit(self::$user_url)
                    ->press('ユーザー情報を編集する');

            $ini = $browser->attribute('#name', 'value');
            $aft = 'TEST';

            // 変更可能かどうか
            $browser->type('name', $aft)
                    ->press('編集する')
                    ->assertPathIs(self::$user_url)
                    ->assertSee($aft);
            
            // 元に戻す
            $browser->press('ユーザー情報を編集する')
                    ->type('name', $ini)
                    ->press('編集する');

        });
    }

    public function testValidationUserName()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(self::$edit_url);

            $ini = $browser->attribute('#name', 'value');
            $empty = '';
            $too_long = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

            // 空の場合、NG
            $browser->type('name', $empty)
                    ->press('編集する')
                    ->assertPathIs(self::$edit_url);
            
            // 32文字以上、NG
            $browser->type('name', $too_long)
                    ->press('編集する')
                    ->assertSee('長すぎます');
        });
    }

    public function testEditUserId()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(self::$edit_url);

            $ini = $browser->attribute('#str_id', 'value');
            $aft = 'TEST_ID';

            // 変更可能かどうか
            $browser->type('str_id', $aft)
                    ->press('編集する')
                    ->assertPathIs('/user/' . $aft)     // パスも新しくなる
                    ->assertSee($aft);
            
            // 元に戻す
            $browser->press('ユーザー情報を編集する')
                    ->type('str_id', $ini)
                    ->press('編集する');

        });
    }

    public function testValidateUserId()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(self::$edit_url);

            $ini = $browser->attribute('#str_id', 'value');
            $empty = '';
            $too_long = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            $already_exists_id = 'guest';

            // 空の場合、NG
            $browser->type('str_id', $empty)
                    ->press('編集する')
                    ->assertPathIs(self::$edit_url);
            
            // 16文字以上、NG
            $browser->type('str_id', $too_long)
                    ->press('編集する')
                    ->assertSee('長すぎます');

            // 既に存在するID、NG
            $browser->type('str_id', $already_exists_id)
                    ->press('編集する')
                    ->assertSee('既に');
        });
        
    }

    public function testDeleteUserAndCannotAccessUserPageAfterDelete()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(self::$edit_url)
                    ->press('アカウントを削除する')
                    ->assertPathIs('/');

            $browser->visit(self::$edit_url)
                    ->assertPathIs('/');

            $browser->visit(self::$user_url)
                    ->assertPathIs('/');
            
        });
    }

}
