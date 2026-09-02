<?php

namespace App\Http\Requests\Provinces;

use App\Concerns\ProvinceValidationRules;
use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProvinceRequest extends FormRequest
{
    use ProvinceValidationRules;

    public function authorize(): bool
    {
        $province = $this->route('province');

        return $province instanceof Province
            && ($this->user()?->can('update', $province) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $province = $this->route('province');

        return $this->provinceRules(
            $province instanceof Province ? $province->id : null,
        );
    }
}
