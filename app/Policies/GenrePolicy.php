<?php

namespace App\Policies;

use App\User;
use App\Genre;
use App\Book;
use Illuminate\Auth\Access\HandlesAuthorization;

class GenrePolicy
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

    public function edit(User $user, Genre $genre)
    {
        $book = $genre->books->first();
        return $user->id === $book->user_id;
    }
}
