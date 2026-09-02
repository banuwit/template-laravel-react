<?php

namespace App\Http\Requests\Provinces;

use App\Concerns\ProvinceValidationRules;
use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProvinceRequest extends FormRequest
{
    use ProvinceValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Province::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->provinceRules();
    }
}
