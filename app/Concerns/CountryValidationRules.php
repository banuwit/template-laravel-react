<?php

namespace App\Concerns;

use App\Models\Country;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

trait CountryValidationRules
{
    /**
     * Normalize the ISO country code before validation.
     */
    protected function prepareForValidation(): void
    {
        $code = $this->input('code');

        if (is_string($code)) {
            $this->merge([
                'code' => Str::upper($code),
            ]);
        }
    }

    /**
     * Get the validation rules used to validate countries.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function countryRules(?int $countryId = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                $countryId === null
                    ? Rule::unique(Country::class)
                    : Rule::unique(Country::class)->ignore($countryId),
            ],
            'code' => [
                'required',
                'string',
                'size:2',
                'regex:/^[A-Z]{2}$/',
                $countryId === null
                    ? Rule::unique(Country::class)
                    : Rule::unique(Country::class)->ignore($countryId),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.size' => 'The code must be a two-letter ISO country code.',
            'code.regex' => 'The code must be a two-letter ISO country code.',
        ];
    }
}
