<?php

namespace App\Http\Requests\Cities;

use App\Concerns\CityValidationRules;
use App\Models\City;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCityRequest extends FormRequest
{
    use CityValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $city = $this->route('city');

        return $city instanceof City && ($this->user()?->can('update', $city) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $city = $this->route('city');
        $cityId = $city instanceof City ? $city->id : null;

        return $this->cityRules($cityId);
    }
}
