<?php

namespace App\Concerns;

use App\Models\City;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait CityValidationRules
{
    /**
     * Get the validation rules used to validate cities.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function cityRules(?int $cityId = null): array
    {
        $provinceId = $this->input('province_id');

        return [
            'province_id' => ['required', 'integer', 'exists:provinces,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(City::class)
                    ->where('province_id', $provinceId)
                    ->ignore($cityId),
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique(City::class)
                    ->where('province_id', $provinceId)
                    ->ignore($cityId),
            ],
        ];
    }
}
