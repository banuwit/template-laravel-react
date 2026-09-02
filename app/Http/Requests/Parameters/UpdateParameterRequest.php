<?php

namespace App\Http\Requests\Parameters;

use App\Concerns\ParameterValidationRules;
use App\Models\Parameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateParameterRequest extends FormRequest
{
    use ParameterValidationRules;

    public function authorize(): bool
    {
        $parameter = $this->route('parameter');

        return $parameter instanceof Parameter
            && ($this->user()?->can('update', $parameter) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $parameter = $this->route('parameter');

        return $this->parameterRules(
            $parameter instanceof Parameter ? $parameter->id : null,
        );
    }
}
