<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Follower;

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

            // フォロー後、フォロー外した後の2回チェック
            $this->assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id);
            $this->assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id);
        });
    }

    public function testShowFollows()
    {
        $this->browse(function (Browser $browser) {

            $this->assertCanSeeFollowsOrFollowers($browser, 'follow');
        });
    }

    public function testShowFollowers()
    {
        $this->browse(function (Browser $browser) {

            $this->assertCanSeeFollowsOrFollowers($browser, 'follower');
        });
    }

    public function getFollowNumber($browser, $id)
    {
        return $browser->visit('/user/show/' . $id)
                      ->attribute('#follow', 'data-count');
    }

    public function getFollowerNumber($browser, $id)
    {
        return $browser->visit('/user/show/' . $id)
                      ->attribute('#follower', 'data-count');
    }

    public function assertCorrectFollowAndFollowerNumber($browser, $guest_id, $target_id)
    {
        // 最初のフォロー数、相手のフォロワー数取得
        $ini_follow = $this->getFollowNumber($browser, $guest_id);
        $ini_target_follower = $this->getFollowerNumber($browser, $target_id);

        $browser->visit('/user/show/' . $target_id)
                ->press('action')
                ->pause(500); // DBに書き込まれるまで少し待つ
        
        // ボタン押下後のフォロー数、相手のフォロワー数取得
        $aft_follow = $this->getFollowNumber($browser, $guest_id);
        $aft_target_follower = $this->getFollowerNumber($browser, $target_id);

        $is_following = $aft_follow > $ini_follow;

        $delta = $is_following ? 1 : -1;

        $this->assertEquals($aft_follow, $ini_follow + $delta);
        $this->assertEquals($aft_target_follower, $ini_target_follower + $delta);
    }

    public function assertCanSeeFollowsOrFollowers($browser, $name)
    {
        $user = User::find(1);
        $table = Follower::with('followUser')->get();
        $column = ($name == 'follow') ? 'follower_id' : 'follow_id';

        $people = $table->where($column, $user->id);

        $browser->visit('/user/show/' . $user->str_id)
                ->click('#' . $name . '-link');

        foreach ($people as $person) {
            $relation = $name . 'User';
            $browser->assertSee($person->$relation->name);
        }
    }
}
