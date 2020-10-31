<?php

use Illuminate\Database\Seeder;
use App\Events\Followed;

class FollowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $count = count(UserSeeder::$users);

        // 全員相互フォロー
        foreach (range(1, $count) as $follow_id) {
            foreach (range(1, $count) as $follower_id) {
                if ($follow_id != $follower_id) {
                    $follower = App\Follower::create([
                        'follow_id' => $follow_id,
                        'follower_id' => $follower_id,
                    ]);

                    event(new Followed($follower));
                }
            }
        }
    }
}
