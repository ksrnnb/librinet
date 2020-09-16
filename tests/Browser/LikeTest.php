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

            $count = $browser->attribute('.count', 'data-count');
            $this->assertEquals($count, ($ini + 1) % 2);

            $browser->press('いいね');

            $count = $browser->attribute('.count', 'data-count');
            $this->assertEquals($count, $ini % 2);
        });
    }
}
