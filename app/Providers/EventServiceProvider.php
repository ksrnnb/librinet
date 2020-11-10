<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        'App\Events\Commented' => [
            'App\Listeners\CreateCommentNotification',
        ],

        'App\Events\Liked' => [
            'App\Listeners\CreateLikeNotification',
        ],

        'App\Events\Unliked' => [
            'App\Listeners\DeleteLikeNotification',
        ],

        'App\Events\Followed' => [
            'App\Listeners\CreateFollowNotification',
        ],

        'App\Events\Unfollowed' => [
            'App\Listeners\DeleteFollowNotification',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
