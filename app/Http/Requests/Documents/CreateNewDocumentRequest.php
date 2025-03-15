<?php

namespace App\Http\Requests\Documents;

use Illuminate\Foundation\Http\FormRequest;

class CreateNewDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Replace with authorization logic
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'area_id' => [
                'numeric', 'required', 'exists:areas,id',
            ],
            'discipline_id' => [
                'numeric', 'required', 'exists:disciplines,id',
            ],
            'is_placeholder' => [
                'boolean', 'nullable'
            ],
            'name' => [
                'string', 'required', 'max:255'
            ],
            'revision_id' => [
                'numeric', 'required', 'exists:revisions,id',
            ],
            'status_id' => [
                'numeric', 'required', 'exists:statuses,id',
            ],
            'tags' => [
                'nullable'
            ],
            'type_id' => [
                'numeric', 'required', 'exists:types,id',
            ],
            'description' => [
                'nullable', 'max:25000',
            ]
        ];
    }

    public function messages(): array
    {
        return [
            '*.required' => ':attribute is required, please select one from the dropdown',
            '*.exists' => 'The selected :attribute could not be found, please reload the page and try again.',
            '*.numeric' => 'Please select an :attribute from the list.',
        ];
    }
}
