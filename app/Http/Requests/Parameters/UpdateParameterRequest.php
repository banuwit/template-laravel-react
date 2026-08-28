<?php

namespace App\Http\Requests\Parameters;

use App\Concerns\ParameterValidationRules;
use App\Models\Parameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateParameterRequest extends FormRequest
{
    use ParameterValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $parameter = $this->route('parameter');

        return $parameter instanceof Parameter && ($this->user()?->can('update', $parameter) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $parameter = $this->route('parameter');
        $parameterId = $parameter instanceof Parameter ? $parameter->id : null;

        return $this->parameterRules($parameterId);
    }
}
