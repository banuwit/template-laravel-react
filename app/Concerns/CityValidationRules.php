<?php

namespace App\Concerns;

use App\Models\City;
use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

trait CityValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function cityRules(?int $cityId = null): array
    {
        return [
            'province_id' => ['required', 'integer', Rule::exists(Province::class, 'id')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique(City::class)
                    ->where('province_id', $this->input('province_id'))
                    ->when($cityId !== null, fn (Unique $rule): Unique => $rule->ignore($cityId)),
            ],
        ];
    }
}
