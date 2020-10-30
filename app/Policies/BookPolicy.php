<?php

namespace App\Policies;

use App\User;
use App\Book;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookPolicy
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

    /**
     * 本を削除する際に、ユーザーIDの一致を確認する
     *
     * @return bool
     */
    public function delete(User $user, Book $book)
    {
        return $user->id === $book->user_id;
    }
}
