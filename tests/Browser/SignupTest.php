<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class SignupTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function correctInput($browser)
    {
        $browser->type('user-name', 'test_user')
                ->type('user-id', 'test_id')
                ->type('email', 'test@test.com')
                ->type('email', 'test@test.com')
                ->type('password', 'test_password')
                ->type('confirm-password', 'test_password');

        return $browser;
    }

    public function testNoInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name')
                    ->press('ユーザー登録')
                    ->assertSee('ユーザー名が入力されていません')
                    ->assertSee('ユーザーIDが入力されていません')
                    ->assertSee('メールアドレスが入力されていません')
                    ->assertSee('パスワードが入力されていません')
                    ->assertSee('確認用パスワードが入力されていません');
        });
    }

    public function testUserNameIncludeSpace()
    {
        $this->markTestIncomplete('まだ完成していない');

        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name');
            
            $browser = $this->correctInput($browser);

            $browser->type('user-name', 'space include name')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');
        });
    }

    public function testStrIdIsNotAlphaNumeric()
    {
        $this->markTestIncomplete('まだ完成していない');

        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name');
            
            $browser = $this->correctInput($browser);

            $browser->type('user-id', '日本語NGテスト')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            $browser->type('user-id', '<@Test_Symbol_is_NG@>')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');
        });
    }

    // LaravelのValidationでチェックしているから、
    // Front側のバリデーションは日本語がないことと@が正しい位置にあることを最低限確認する。
    public function testEmailIsNotCorrect()
    {
        $this->markTestIncomplete('まだ完成していない');

        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name');
            
            $browser = $this->correctInput($browser);

            // 日本語を含む場合
            $browser->type('email', '日本語NGテスト@test.com')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // @を含まない場合
            $browser->type('email', 'no_include_at_sign')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // @で始まる場合
            $browser->type('email', '@start_at_sign.com')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // @で終わる場合
            $browser->type('email', 'end_at_sign@')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');
        });
    }

    public function testPasswordIsNotCorrect()
    {
        $this->markTestIncomplete('まだ完成していない');

        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name');
            
            $browser = $this->correctInput($browser);

            // 一致しない場合
            $wrong_password_1 = 'test_not_match';
            $wrong_password_2 = 'test_not_match_password';

            $browser->type('password', $wrong_password_1)
                    ->type('confirm-password', $wrong_password_2)
                    ->screenshot('pic')
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // 日本語を含む場合
            $wrong_password = '日本語NGテスト';
            $browser->type('password', $wrong_password)
                    ->type('confirm-password', $wrong_password)
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // 6文字未満の場合
            $wrong_password = 'short';
            $browser->type('password', $wrong_password)
                    ->type('confirm-password', $wrong_password)
                    ->press('ユーザー登録')
                    ->assertPresent('.error');

            // スペースを含む場合
            $wrong_password = 'include space password';
            $browser->type('password', $wrong_password)
                    ->type('confirm-password', $wrong_password)
                    ->press('ユーザー登録')
                    ->assertPresent('.error');
        });
    }

    public function testSignup()
    {
        $this->markTestIncomplete('まだ完成していない');

        $this->browse(function (Browser $browser) {
            $browser->visit('/signup')
                    ->waitFor('#user-name');
            
            $browser = $this->correctInput($browser);

            $browser->press('ユーザー登録')
                    ->waitForText('Home');
        });
    }
}
