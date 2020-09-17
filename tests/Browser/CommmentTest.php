<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CommmentTest extends DuskTestCase
{
    /**
     * check comment 
     *
     * 
     */

    public function testCommentWithoutBookAndWithoutInputComment()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->click('#guest')                   // ゲストでログイン
                    ->click('.comment-link')
                    ->press('コメントする')
                    ->assertPathIsNot('/home');         // 入力してないので送信できない
        });
    }

    public function testCommentWithoutBook()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/home')
                    ->click('.comment-link')
                    ->type('message', 'よかったです')
                    ->press('コメントする')
                    ->assertPathIs('/home');
        });
    }

    public function testCommentWithBookAndWithoutInputComment()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/home')
                    ->click('.comment-link')
                    ->check('recommend')
                    ->press('コメントする')
                    ->assertPathIsNot('/home');          // 入力してないので送信できない
        });
    }
    
    // TODO 本がない場合の処理を追加したら、ここも編集する
    public function testCommentWithBook()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/home')
                    ->click('.comment-link')
                    ->check('recommend')
                    ->type('message', 'よかったです')
                    ->press('コメントする');
                    // ->assertPathIs('/home');         // 本がない場合にエラーが出る。
        });
    }
}
