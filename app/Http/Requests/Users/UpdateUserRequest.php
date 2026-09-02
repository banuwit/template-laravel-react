<?php

namespace App\Http\Requests\Users;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    use ExampleRecordValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->route('user');

        return $user instanceof User && ($this->user()?->can('update', $user) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->route('user');
        $userId = $user instanceof User ? $user->id : null;

        return [
            ...$this->exampleRecordRules(User::class, $userId),
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function userAttributes(): array
    {
        $attributes = $this->safe()->only([
            'name',
            'email',
            'phone',
            'department',
            'position',
            'join_date',
            'gender',
            'status',
        ]);
        $password = $this->validated('password');

        if (is_string($password) && $password !== '') {
            $attributes['password'] = $password;
        }

        return $attributes;
    }
}
