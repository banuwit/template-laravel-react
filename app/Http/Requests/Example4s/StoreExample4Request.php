<?php

namespace App\Http\Requests\Example4s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example4;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExample4Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Example4::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->exampleRecordRules(Example4::class);
    }
}
