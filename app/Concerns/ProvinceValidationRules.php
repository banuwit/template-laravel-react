<?php

namespace App\Concerns;

use App\Models\Country;
use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

trait ProvinceValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function provinceRules(?int $provinceId = null): array
    {
        return [
            'country_id' => ['required', 'integer', Rule::exists(Country::class, 'id')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique(Province::class)
                    ->where('country_id', $this->input('country_id'))
                    ->when($provinceId !== null, fn (Unique $rule): Unique => $rule->ignore($provinceId)),
            ],
        ];
    }
}
