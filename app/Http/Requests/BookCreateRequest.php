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
            'new_genre' => ['max:16', new UniqueGenre],
            'genre_id'  => 'numeric',
        ];
    }


    public function messages()
    {
        return [
            'new_genre.max'    => 'ジャンル名が長すぎます。16文字以内で入力してください。',
        ];
    }
}
