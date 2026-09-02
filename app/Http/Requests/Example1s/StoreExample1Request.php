<?php

namespace App\Http\Requests\Example1s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example1;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExample1Request extends FormRequest
{
    use ExampleRecordValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Example1::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->exampleRecordRules(Example1::class);
    }
}
