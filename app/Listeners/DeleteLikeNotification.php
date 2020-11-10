<?php

namespace App\Listeners;

use App\Events\Unliked;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notification;

class DeleteLikeNotification
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
     * @param  Unliked  $event
     * @return void
     */
    public function handle(Unliked $event)
    {
        $like = $event->like;

        $notification = Notification::where('like_id', $like->id)
                                    ->first();

        if ($notification) {
            $notification->delete();
        }
    }
}
