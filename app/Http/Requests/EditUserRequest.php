<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditUserRequest extends FormRequest
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
        // TODO: 要修正
        return [
            'id' => 'integer',
            'str_id' => 'max:16',
            // 'str_id' => ['max:16', new Rule()],
            'name' => 'max:32',
            'email' => 'email address',
            // 'image' => ''
        ];
    }
}
