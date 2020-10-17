<?php

namespace App\Listeners;

use App\Events\Liked;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notification;

class CreateLikeNotification
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
     * @param  Liked  $event
     * @return void
     */
    public function handle(Liked $event)
    {
        $like = $event->like;
        
        if ($like['post_id']) {
            $user_id = $like->post->user_id;
        } elseif ($like['comment_id']) {
            $user_id = $like->comment->user_id;
        }
        
        Notification::create([
            'user_id' => $user_id,
            'like_id' => $like->id,
        ]);
    }
}
