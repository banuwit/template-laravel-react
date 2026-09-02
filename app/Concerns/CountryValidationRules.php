<?php

namespace App\Concerns;

use App\Models\Country;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait CountryValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function countryRules(?int $countryId = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                $countryId === null
                    ? Rule::unique(Country::class)
                    : Rule::unique(Country::class)->ignore($countryId),
            ],
            'code' => [
                'required',
                'string',
                'size:2',
                'alpha',
                'uppercase',
                $countryId === null
                    ? Rule::unique(Country::class)
                    : Rule::unique(Country::class)->ignore($countryId),
            ],
        ];
    }
}
