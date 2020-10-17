<?php

namespace App\Listeners;

use App\Events\Commented;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notification;

class CreateCommentNotification
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
     * @param  Commented  $event
     * @return void
     */
    public function handle(Commented $event)
    {
        $comment = $event->comment;
        $post = $comment->post;

        Notification::create([
            'user_id' => $post->user_id,
            'comment_id' => $comment->id,
        ]);
    }
}
