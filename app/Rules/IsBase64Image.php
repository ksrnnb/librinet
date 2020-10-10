<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class IsBase64Image implements Rule
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
        $conventional_image = Auth::user()->image;

        if ($value == $conventional_image) {
            return true;
        }

        $is_jpeg = strpos($value, 'data:image/jpeg;base64') === 0;
        $is_png = strpos($value, 'data:image/png;base64') === 0;

        return $is_jpeg || $is_png;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return '指定された形式の画像データではありません';
    }
}
