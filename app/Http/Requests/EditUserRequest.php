<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueStrId;
use App\Rules\IsBase64Image;
use Illuminate\Support\Facades\Auth;

class EditUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        // TODO: 要修正
        return [
            'user.id' => 'integer',
            'user.name' => ['min:1, max:32'],
            // userでデータを受け取ってるからuniqueは使えない
            'user.str_id' => ['min:4', 'max:32', new UniqueStrId()],
            // 'user.email' => 'email address',
            'user.image' => ['nullable', new IsBase64Image()],
        ];
    }

    public function messages()
    {
        return [
            'user.name.min' => 'ユーザー名が短すぎます',
            'user.name.max' => 'ユーザー名が長すぎます',
            'user.str_id.min' => 'ユーザーIDが短すぎます',
            'user.str_id.max' => 'ユーザーIDが長すぎます',
        ];
    }
}
