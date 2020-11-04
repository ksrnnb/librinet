<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;

class EditGenre implements Rule
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
        $new_genres = Arr::wrap($value);

        // nullか16文字以上はNG
        foreach ($new_genres as $new_genre) {
            if ($new_genre == null) {
                return false;
            } elseif (strlen($new_genre) > 16) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'ジャンルが正しく入力されていません';
    }
}
