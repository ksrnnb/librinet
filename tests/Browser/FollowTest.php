<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use Illuminate\Support\Facades\Auth;


class FollowTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testFollowAction()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->click('#guest');      // ゲストでログイン

            $guest_id = 'guest';
            $target_id = User::find(1)->str_id;

            $this->assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id);  // フォロー後のチェック
            $this->assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id);  // フォロー外した後のチェック
            
        });
    }

    public function getFollowNumber($browser, $id)
    {
        return $browser->visit('/user/' . $id)
                      ->attribute('#follow', 'data-count');
    }

    public function getFollowerNumber($browser, $id)
    {
        return $browser->visit('/user/' . $id)
                      ->attribute('#follower', 'data-count');
    }

    public function assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id)
    {
        $ini_follow = $this->getFollowNumber($browser, $guest_id);
        $ini_target_follower = $this->getFollowerNumber($browser, $target_id);

        $browser->visit('/user/' . $target_id)
                ->press('action');
        
        $aft_follow = $this->getFollowNumber($browser, $guest_id);
        $aft_target_follower = $this->getFollowerNumber($browser, $target_id);

        $is_following = $aft_follow > $ini_follow;

        $delta = $is_following ? 1 : -1;

        $this->assertEquals($aft_follow, $ini_follow + $delta);
        $this->assertEquals($aft_target_follower, $ini_target_follower + $delta);
    }
}
