<?php

namespace App\Http\Requests\Parameters;

use App\Concerns\ParameterValidationRules;
use App\Models\Parameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreParameterRequest extends FormRequest
{
    use ParameterValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Parameter::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->parameterRules();
    }
}
