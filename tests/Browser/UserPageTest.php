<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class UserPageTest extends DuskTestCase
{
    // use DatabaseMigrations;

    // protected $user;
    // protected $hasCreated = false;

    // protected function setUp(): void
    // {
    //     parent::setUp();
    //     if (!$this->hasCreated) {
    //         $this->hasCreated = true;
    //         $this->user = Factory(User::class)->create();
    //     }
    // }

    // public function testCanSeeUserName()
    // {
    //     $this->browse(function (Browser $browser) {
    //         $str_id = $this->user->str_id;

    //         $browser->visit('/user/profile/' . $str_id)
    //                 ->waitFor('.user-card')
    //                 ->assertSee($user->name);
    //     });
    // }
}
