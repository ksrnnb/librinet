<?php

namespace App\Listeners;

use App\Events\Followed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notification;

class CreateFollowNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Followed  $event
     * @return void
     */
    public function handle(Followed $event)
    {
        $follower = $event->follower;

        // 自分で自分をフォローした場合は、Notificationを作成しない。
        if ($follower->follow_id !== $follower->follower_id) {
            Notification::create([
                'user_id' => $follower->follow_id,
                'follower_id' => $follower->follower_id,
            ]);
        }
    }
}
