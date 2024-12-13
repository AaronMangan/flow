<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (\Auth::user()->hasRole('super')) {
            return true;
        } else {
            return (\Auth::user()->hasRole('admin') && $this->organisation_id == \Auth::user()->organisation_id) ? true : false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'required', 'max:255'],
            'email' => ['email', 'required'],
            'status_id' => ['numeric', 'exists:statuses,id'],
            'organisation_id' => ['numeric', 'exists:organisations,id']
        ];
    }
}
