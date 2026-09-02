<?php

namespace App\Http\Requests\Example3s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example3;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExample3Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Example3::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->exampleRecordRules(Example3::class);
    }
}
