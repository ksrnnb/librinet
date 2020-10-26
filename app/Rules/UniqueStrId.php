<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\User;
use Illuminate\Support\Facades\Auth;

class UniqueStrId implements Rule
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
        $conventional_str_id = Auth::user()->str_id;

        if ($value == $conventional_str_id) {
            return true;
        }

        // 更新された場合、uniqueかどうかの確認
        $is_unique = User::where('str_id', $value)->count() === 0;

        return $is_unique;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return '入力したIDのユーザーが既に存在しています';
    }
}
