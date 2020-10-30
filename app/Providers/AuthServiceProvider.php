<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\BookPolicy;
use App\Policies\CommentPolicy;
use App\Policies\FollowerPolicy;
use App\Policies\GenrePolicy;
use App\Policies\PostPolicy;
use App\Policies\UserPolicy;
use App\Book;
use App\Comment;
use App\Follower;
use App\Genre;
use App\Post;
use App\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Book::class => BookPolicy::class,
        Comment::class => CommentPolicy::class,
        Follower::class => FollowerPolicy::class,
        Genre::class => GenrePolicy::class,
        Post::class => PostPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('create-book', 'App\Policies\BookPolicy@create');
        Gate::define('create-comment', 'App\Policies\CommentPolicy@create');
        Gate::define('create-follower', 'App\Policies\FollowerPolicy@create');
        Gate::define('create-post', 'App\Policies\PostPolicy@create');

        Gate::define('edit-genre', 'App\Policies\GenrePolicy@edit');
        Gate::define('edit-user', 'App\Policies\UserPolicy@edit');

        Gate::define('delete-book', 'App\Policies\BookPolicy@delete');
        Gate::define('delete-comment', 'App\Policies\CommentPolicy@delete');
        Gate::define('delete-follower', 'App\Policies\FollowerPolicy@delete');
        Gate::define('delete-post', 'App\Policies\PostPolicy@delete');
        Gate::define('delete-user', 'App\Policies\UserPolicy@delete');
    }
}
