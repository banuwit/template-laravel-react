<?php

namespace App\Concerns;

use App\Models\Parameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ParameterValidationRules
{
    /**
     * Get the validation rules used to validate parameters.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function parameterRules(?int $parameterId = null): array
    {
        return [
            'group' => ['required', 'string', 'max:50'],
            'code' => $this->codeRules($parameterId),
            'value' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'text_color' => ['nullable', 'string', 'max:10', 'regex:/^#([A-Fa-f0-9]{3,8})$/'],
            'bg_color' => ['nullable', 'string', 'max:10', 'regex:/^#([A-Fa-f0-9]{3,8})$/'],
            'is_system' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }

    /**
     * Get the validation rules used to validate parameter codes.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function codeRules(?int $parameterId = null): array
    {
        return [
            'required',
            'string',
            'max:100',
            $parameterId === null
                ? Rule::unique(Parameter::class)
                : Rule::unique(Parameter::class)->ignore($parameterId),
        ];
    }
}
