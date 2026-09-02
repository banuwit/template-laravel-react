<?php

namespace App\Http\Requests\Parameters;

use App\Models\Parameter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexParameterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Parameter::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}
