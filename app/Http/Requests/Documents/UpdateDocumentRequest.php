<?php

namespace App\Http\Requests\Documents;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Replace with authorization logic
        // return true;
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
            'document_number' => [
                'alpha_dash', 'nullable'
            ],
            'area_id' => [
                'exists:areas,id', 'numeric', 'required'
            ],
            'discipline_id' => [
                'exists:disciplines,id', 'numeric', 'required'
            ],
            'is_placeholder' => [
                'boolean', 'nullable'
            ],
            'name' => [
                'string', 'required', 'max:255'
            ],
            'revision_id' => [
                'exists:revisions,id', 'numeric', 'required'
            ],
            'status_id' => [
                'exists:statuses,id', 'numeric', 'required'
            ],
            'tags' => [
                'nullable'
            ],
            'type_id' => [
                'exists:types,id', 'numeric', 'required'
            ],
            'description' => [
                'nullable', 'max:25000',
            ]
        ];
    }

    public function messages(): array
    {
        return [
            '*.exists' => 'The selected :attribute could not be found, please reload the page and try again.',
            '*.numeric' => 'Please select an :attribute from the list.',
            '*.required' => ':attribute is required, please select one from the dropdown',
        ];
    }
}
