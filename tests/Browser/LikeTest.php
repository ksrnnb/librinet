<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LikeTest extends DuskTestCase
{
    /**
     * check like funciton
     */
    // public function testLike()
    // {
        // TODO: ログインがうまく動作していない。Sanctumの問題？

        // $this->browse(function (Browser $browser) {
        //     $browser->visit('/login')
        //             ->click('#guest')  // ゲストでログイン
        //             ->waitFor('.feed');

        //     $ini = $browser->attribute('.count', 'data-count');
            
        //     $browser->press('いいね')
        //             ->pause(100);       // データベースの書き込みのため少し待つ

        //     // 増えた or 減った
        //     $count = $browser->attribute('.count', 'data-count');
        //     $this->assertEquals($count, ($ini + 1) % 2);
            
        //     // ページ再読み込みして変わらないのを確認
        //     $browser->refresh();
        //     $count = $browser->attribute('.count', 'data-count');
        //     $this->assertEquals($count, ($ini + 1) % 2);
        
        //     // もう一回いいね押す
        //     $browser->press('いいね')
        //             ->pause(100);       // データベースの書き込みのため少し待つ


        //     // 減った or 増えた
        //     $count = $browser->attribute('.count', 'data-count');
        //     $this->assertEquals($count, $ini % 2);
            
        //     // ページ再読み込みして変わらないのを確認
        //     $browser->refresh();
        //     $count = $browser->attribute('.count', 'data-count');
        //     $this->assertEquals($count, $ini % 2);
        // });
    // }
}
