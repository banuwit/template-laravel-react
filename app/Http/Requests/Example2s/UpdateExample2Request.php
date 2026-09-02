<?php

namespace App\Http\Requests\Example2s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example2;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExample2Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        $example2 = $this->route('example2');

        return $example2 instanceof Example2
            && ($this->user()?->can('update', $example2) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $example2 = $this->route('example2');

        return $this->exampleRecordRules(
            Example2::class,
            $example2 instanceof Example2 ? $example2->id : null,
        );
    }
}
