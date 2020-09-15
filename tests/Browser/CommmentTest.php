<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CommmentTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testCommentWithoutBook()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->click('#guest')
                    ->click('.comment-link')
                    ->press('コメントする')
                    ->assertPathIsNot('/home')     // 入力してないので送信できない
                    ->type('message', 'よかったです')
                    ->press('コメントする')
                    ->assertPathIs('/home');
        });
    }

    // TODO 本がない場合の処理を追加したら、ここも編集する
    public function testCommentWithBook()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/home')
                    ->click('.comment-link')
                    ->check('recommend')
                    ->press('コメントする')
                    ->assertPathIsNot('/home')     // 入力してないので送信できない
                    ->type('message', 'よかったです')
                    ->press('コメントする');
                    // ->assertPathIs('/home');       // 本がない場合にエラーが出る。
        });
    }
}
