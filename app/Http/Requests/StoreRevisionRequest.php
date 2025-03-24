<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;

class StoreRevisionRequest extends FormRequest
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
            'draft' => [
                'boolean', 'nullable'
            ],
            'weight' => [
                'integer', 'nullable', Rule::unique('revisions')->where(fn (Builder $query) => $query->where('organisation_id', \Auth::user()->organisation_id))
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'weight.unique' => 'This weight is already being used, please use another value'
        ];
    }
}
