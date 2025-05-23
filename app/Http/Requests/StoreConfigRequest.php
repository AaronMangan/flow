<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConfigRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return \Auth::user()->hasAnyRole(['super', 'admin']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'string', 'required', 'max:255'
            ],
            'key' => [
                'string', 'alpha_dash', 'regex:/^\S+$/', 'max:255'
            ],
            'values' => [
                'json'
            ],
            'organisation_id' => [
                'numeric', 'nullable', 'exists:organisations,id'
            ]
        ];
    }
}
