<?php

namespace App\Concerns;

use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProvinceValidationRules
{
    /**
     * Get the validation rules used to validate provinces.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function provinceRules(?int $provinceId = null): array
    {
        $countryId = $this->input('country_id');

        return [
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Province::class)
                    ->where('country_id', $countryId)
                    ->ignore($provinceId),
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique(Province::class)
                    ->where('country_id', $countryId)
                    ->ignore($provinceId),
            ],
        ];
    }
}
