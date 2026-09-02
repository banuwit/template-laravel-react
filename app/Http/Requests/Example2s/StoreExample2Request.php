<?php

namespace App\Http\Requests\Example2s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example2;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExample2Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Example2::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->exampleRecordRules(Example2::class);
    }
}
