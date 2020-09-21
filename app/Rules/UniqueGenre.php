<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;


class UniqueGenre implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $user_id = Auth::id();
        $books = \App\Book::with('genre')
                          ->where('user_id', $user_id)
                          ->get();
                          
        $doesnt_have_book = true;

        foreach ($books as $book) {
            if ($book->genre->name == $value) {
                // 既にジャンルが存在する場合はNG
                $doesnt_have_book = false;
            }
        }

        return $doesnt_have_book;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return '既にジャンル名が存在しています。違う名前を入力してください。';
    }
}
