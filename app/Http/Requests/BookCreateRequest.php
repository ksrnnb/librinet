<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueGenre;

class BookCreateRequest extends FormRequest
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
            'user_id'       => ['required'],
            'isInBookshelf' => ['required'],
            'isbn'          => ['required', 'regex:/^9784[0-9]{9}$/'],
            'title'         => ['required'],
            'author'        => ['required'],
            'publisher'     => ['required'],
            'pubdate'       => ['required'],
            'cover'         => ['nullable'],
            'is_new_genre'  => ['required', 'bool'],
            'new_genre'     => ['required_if:is_new_genre,true', 'max:16', new UniqueGenre()],
            'genre_id'      => ['nullable', 'numeric']
        ];
    }

    public function messages()
    {
        return [
            'new_genre.max'    => 'ジャンル名が長すぎます。16文字以内で入力してください。',
            'genre_id'    => 'ジャンルが正しく選択されていません',
        ];
    }
}
