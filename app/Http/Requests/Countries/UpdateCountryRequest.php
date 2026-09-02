<?php

namespace App\Http\Requests\Countries;

use App\Concerns\CountryValidationRules;
use App\Models\Country;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCountryRequest extends FormRequest
{
    use CountryValidationRules;

    public function authorize(): bool
    {
        $country = $this->route('country');

        return $country instanceof Country
            && ($this->user()?->can('update', $country) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $country = $this->route('country');

        return $this->countryRules(
            $country instanceof Country ? $country->id : null,
        );
    }
}
