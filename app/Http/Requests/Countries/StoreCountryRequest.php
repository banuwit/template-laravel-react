<?php

namespace App\Http\Requests\Countries;

use App\Concerns\CountryValidationRules;
use App\Models\Country;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCountryRequest extends FormRequest
{
    use CountryValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Country::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->countryRules();
    }
}
