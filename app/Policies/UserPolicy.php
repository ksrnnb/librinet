<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
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

    public function edit(User $user, int $id)
    {
        return $user->id === $id;
    }

    public function delete(User $user, int $id)
    {
        return $user->id === $id;
    }
}
