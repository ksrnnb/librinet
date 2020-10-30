<?php

namespace App\Policies;

use App\User;
use App\Follower;
use Illuminate\Auth\Access\HandlesAuthorization;

class FollowerPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function create(User $user)
    {
        return $user !== null;
    }

    public function delete(User $user, Follower $follower)
    {
        return $user->id === $follower->follower_id;
    }
}
