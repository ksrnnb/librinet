<?php

namespace App\Listeners;

use App\Events\Unfollowed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notification;

class DeleteFollowNotification
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
     * @param  Unfollowed  $event
     * @return void
     */
    public function handle(Unfollowed $event)
    {
        $follower = $event->follower;

        $notification = Notification::where('user_id', $follower->follow_id)
                                    ->where('follower_id', $follower->follower_id)
                                    ->first();
        if ($notification) {
            $notification->delete();
        }
    }
}
