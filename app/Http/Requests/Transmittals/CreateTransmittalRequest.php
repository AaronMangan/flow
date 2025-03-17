<?php

namespace App\Http\Requests\Transmittals;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransmittalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // To Do, authorized the action
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
            'to' => [
                'array', 'max:255', 'required'
            ],
            'details' => [
                'string', 'nullable'
            ],
            'documents' => [
                'array', 'required'
            ],
            'transmittal_status' => [
                'numeric', 'required'
            ]
        ];
    }

    /**
     * Returns the messages that are returned when validation fails.
     *
     * @return array<string, array<mixed>|string>
     */
    public function messages(): ?array
    {
        return [

        ];
    }
}
