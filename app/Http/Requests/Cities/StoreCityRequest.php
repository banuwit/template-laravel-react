<?php

namespace App\Http\Requests\Cities;

use App\Concerns\CityValidationRules;
use App\Models\City;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCityRequest extends FormRequest
{
    use CityValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', City::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->cityRules();
    }
}
