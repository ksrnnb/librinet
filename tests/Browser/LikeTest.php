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
    public function testLike()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->click('#guest');  // ゲストでログイン

            $ini = $browser->attribute('.count', 'data-count');
            
            $browser->press('いいね');

            // 増えた or 減った
            $count = $browser->attribute('.count', 'data-count');
            $this->assertEquals($count, ($ini + 1) % 2);

            $browser->press('いいね');

            // 減った or 増えた
            $count = $browser->attribute('.count', 'data-count');
            $this->assertEquals($count, $ini % 2);
        });
    }
}
