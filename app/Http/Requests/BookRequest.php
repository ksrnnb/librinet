<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BookRequest extends FormRequest
{

    protected function prepareForValidation()
    {
        $this->merge([
            'isbn' => preg_replace('/-/', '', $this->isbn),
        ]);
    }
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
            'isbn' => ['required', 'regex:/^9784[0-9]{9}$/'],
        ];
    }

    public function messages()
    {
        return [
            'isbn.required' => 'ISBNが入力されていません',
            'isbn.regex' => '正しいISBNを入力してください',
        ];
    }
}
