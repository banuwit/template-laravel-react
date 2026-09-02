<?php

namespace App\Http\Requests\Users;

use App\Concerns\ExampleRecordValidationRules;
use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    use ExampleRecordValidationRules, PasswordValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...$this->exampleRecordRules(User::class),
            'password' => $this->passwordRules(),
        ];
    }
}
