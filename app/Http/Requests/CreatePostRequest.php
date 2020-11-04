<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueGenre;

class CreatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id'           => ['required'],
            'isbn'              => ['required', 'regex:/^9784[0-9]{9}$/'],
            'title'             => ['required'],
            'author'            => ['required'],
            'publisher'         => ['required'],
            'pubdate'           => ['required'],
            'cover'             => ['required'],
            'is_new_genre'      => ['required', 'bool'],
            'add_to_bookshelf'  => ['required'],
            'message'           => ['required', 'max:100'],
            'new_genre'         => ['required_if:is_new_genre,true', 'max:16', new UniqueGenre()],
            'genre_id'          => ['nullable', 'numeric']
        ];
    }
}
