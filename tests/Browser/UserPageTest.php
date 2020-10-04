<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class UserPageTest extends DuskTestCase
{

    public function testCanSeeUserName()
    {
        $this->browse(function (Browser $browser) {
            $user = User::find(1);

            $browser->visit('/user/profile/' . $user->str_id)
                    ->waitFor('.user-card')
                    ->assertSee($user->name);
        });
    }
}
