<?php

namespace App\Http\Requests\Types;

use Illuminate\Foundation\Http\FormRequest;

class StoreTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return \Auth::user()->hasAnyRole(['admin', 'super']);
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
                'string', 'max:255', 'required',
            ],
            'code' => [
                'string', 'max:255', 'required',
            ],
            'description' => [
                'string', 'max:255', 'nullable',
            ],
            'organisation_id' => [
                'numeric', 'nullable', 'exists:organisations,id'
            ]
        ];
    }
}