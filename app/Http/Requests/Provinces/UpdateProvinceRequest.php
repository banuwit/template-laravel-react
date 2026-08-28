<?php

namespace App\Http\Requests\Provinces;

use App\Concerns\ProvinceValidationRules;
use App\Models\Province;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProvinceRequest extends FormRequest
{
    use ProvinceValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $province = $this->route('province');

        return $province instanceof Province && ($this->user()?->can('update', $province) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $province = $this->route('province');
        $provinceId = $province instanceof Province ? $province->id : null;

        return $this->provinceRules($provinceId);
    }
}
