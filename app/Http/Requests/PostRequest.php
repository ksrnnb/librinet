<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class PostRequest extends FormRequest
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
            'genre' => 'nullable|string',
            'new_genre' => 'nullable|string',
            'genre_id' => 'nullable|integer',
            'message' => 'nullable|string',
            'title' => 'required|string',
            'author' => 'required|string',
            'cover' => 'nullable|url',
            'publisher' => 'required|string',
            'pubdate' => 'required|regex:/^[1-2][0-9]{3}.*/'
        ];
    }

    public function messages()
    {
        return [];
    }
}
