<?php

namespace App\Http\Requests\Countries;

use App\Concerns\CountryValidationRules;
use App\Models\Country;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCountryRequest extends FormRequest
{
    use CountryValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $country = $this->route('country');

        return $country instanceof Country && ($this->user()?->can('update', $country) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $country = $this->route('country');
        $countryId = $country instanceof Country ? $country->id : null;

        return $this->countryRules($countryId);
    }
}
